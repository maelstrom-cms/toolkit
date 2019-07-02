<?php

namespace Maelstrom\Models;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Media
 * @package Maelstrom\Models
 */
class Media extends Model
{
    use SoftDeletes;

    /**
     * Which db table to store the media in
     *
     * @var string
     */
    protected $table = 'maelstrom_media';

    /**
     * Allow all fields to be writable
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Handle attribute casting
     *
     * @var array
     */
    protected $casts = [
        'tags' => 'array',
        'versions' => 'array',
        'size' => 'number',
    ];

    /**
     * Returns back which disk you want to store the media on,
     * this can be remote ones such as S3.
     *
     * @return string
     */
    public function getStorageDiskAttribute(): string
    {
        return config('maelstrom.media_manager.disk', 'public');
    }

    /**
     * Defines what width to make the thumbnails
     *
     * @return int
     */
    public function getThumbnailWidthAttribute(): int
    {
        return config('maelstrom.media_manager.thumbnails.width', 300);
    }

    /**
     * Defines what height to make the thumbnails
     *
     * @return int
     */
    public function getThumbnailHeightAttribute(): int
    {
        return config('maelstrom.media_manager.thumbnails.height', 300);
    }

    /**
     * This will try to guess the original file name along with the extension
     * As some mime types are considered as text or not explicitly set on files
     * if we cannot detect it, we put the same extension on as it was submitted as.
     *
     * @param UploadedFile $file
     * @param string $prefix
     * @return string
     */
    public function guessFileName(UploadedFile $file, $prefix = '')
    {
        $fileName = $file->hashName();

        if (Str::contains($fileName, '.')) {
            return $prefix . $fileName;
        }

        return $prefix . $fileName . '.' . ($file->extension() ?: $file->getClientOriginalExtension());
    }

    /**
     * Here we try and detect the dimensions of the uploaded media,
     * This is straight forward for images, however we do some juggling
     * with SVG to try and extract the sizes from the XML.
     * We don't even bother with PDFs as this requires server side installed
     * packages to make it work like ghostscript. Maybe in the future.
     *
     * @param UploadedFile $file
     * @return string
     */
    public function extractDimensions(UploadedFile $file)
    {
        if (Str::endsWith($this->getAttribute('type'), 'svg')) {
            $xml = simplexml_load_file($file->getRealPath());
            $attr = $xml->attributes();

            if ($attr->height && $attr->width) {
                return sprintf('%dx%d', $attr->width, $attr->height);
            }

            if ($attr->viewBox) {
                $dimensions = explode(' ', $attr->viewBox);

                return sprintf('%dx%d', $dimensions[2], $dimensions[3]);
            }

        } elseif (Str::startsWith($this->getAttribute('type'), 'image')) {
            $dimensions = @getimagesize($file->getRealPath());

            return sprintf('%dx%d', $dimensions[0], $dimensions[1]);
        } elseif (Str::endsWith($this->getAttribute('type'), 'pdf')) {
            return '1x1';
        }
    }

    /**
     * Here we try and create an image resource of the SVG to generate a thumbnail.
     * If you have Imagick installed we can use that to parse the SVG as a PNG, however
     * if you do not have it, we cannot, so we just return the same image back.
     *
     * @param UploadedFile $file
     * @throws \ImagickException
     */
    public function generateSvgThumbnail(UploadedFile $file)
    {
        if (class_exists('Imagick')) {
            $raw = new \Imagick();
            $raw->readImageBlob(file_get_contents($file->getRealPath()));
            $raw->setImageFormat('png24');

            $tmp = tempnam(sys_get_temp_dir(), 'svg');
            $raw->writeImage($tmp);
            $raw->clear();
            $raw->destroy();

            $image = Image::make($tmp);

            $this->generateThumbnailFromBitmap($image, $file->hashName(). '.jpg');
        } else {
            $this->setAttribute('thumbnail_path', $this->getAttribute('path'));
            $this->setAttribute('cached_thumbnail_url', $this->getAttribute('cached_url'));
        }
    }

    /**
     * This simply takes the uploaded file and passes an Intervention
     * image back for resizing for the thumbnail.
     *
     * @param UploadedFile $file
     */
    public function generateBitmapThumbnail(UploadedFile $file)
    {
        /* @var $image \Intervention\Image\Image */
        $image = Image::make($file);

        $this->generateThumbnailFromBitmap($image, $this->guessFileName($file));
    }

    /**
     * As PDF thumbnail generation needs server side scripts
     * for the time being we'll just use a placeholder image from Ant Design Icons.
     *
     * @param UploadedFile $file
     */
    public function generatePdfThumbnail(UploadedFile $file)
    {
        $placeholder = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" width="300" height="300" fill="#1890ff"><path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7-3.8-21.3-19.5-29.6-32.9-30.2-15.8-.7-29.9 8.3-33.4 21.4-6.6 24-.7 56.8 10.1 98.6-13.6 32.4-35.3 79.5-51.2 107.5-29.6 15.3-69.3 38.9-75.2 68.7-1.2 5.5.2 12.5 3.5 18.8 3.7 7 9.6 12.4 16.5 15 3 1.1 6.6 2 10.8 2 17.6 0 46.1-14.2 84.1-79.4 5.8-1.9 11.8-3.9 17.6-5.9 27.2-9.2 55.4-18.8 80.9-23.1 28.2 15.1 60.3 24.8 82.1 24.8 21.6 0 30.1-12.8 33.3-20.5 5.6-13.5 2.9-30.5-6.2-39.6-13.2-13-45.3-16.4-95.3-10.2-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7 6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4-4.9-19.9-5.6-48.1-2.7-51.4.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2-21.6 4.9-41.3 13-58.9 20.2-4.2 1.7-8.3 3.4-12.3 5 13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6 40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path></svg>';
        $this->setAttribute('thumbnail_path', str_replace('.pdf', '.svg', $file->hashName()));
        $this->setAttribute('cached_thumbnail_url', Storage::disk($this->getAttribute('storage_disk'))->url($this->getAttribute('thumbnail_path')));

        Storage::disk($this->getAttribute('storage_disk'))->put($this->getAttribute('thumbnail_path'), $placeholder);
    }

    /**
     * Once each type of upload is ready, we can pass it here to
     * actually generate the thumbnail itself and save it.
     *
     * This thumbnail is mainly used for the Maelstrom media manager, however
     * you're free to use this in your code if you see fit!
     *
     * @param $image
     * @param $filename
     */
    public function generateThumbnailFromBitmap($image, $filename)
    {
        $image->fit($this->getAttribute('thumbnail_height'), $this->getAttribute('thumbnail_width'), function (Constraint $c) {
            $c->aspectRatio();
            $c->upsize();
        });

        $this->setAttribute('thumbnail_path', 'thumb-' . $filename);

        $path = Storage::disk($this->getAttribute('storage_disk'))->path($this->getAttribute('thumbnail_path'));

        $image->save($path);

        $this->setAttribute('cached_thumbnail_url', Storage::disk($this->getAttribute('storage_disk'))->url($this->getAttribute('thumbnail_path')));
    }

    /**
     * Here we just pass off the upload to each appropriate
     * thumbnail generator to handle everything.
     *
     * @param UploadedFile $file
     * @throws \ImagickException
     */
    public function generateThumbnail(UploadedFile $file)
    {
        if (Str::endsWith($this->getAttribute('type'), 'svg')) {
            $this->generateSvgThumbnail($file);
        } elseif (Str::startsWith($this->getAttribute('type'), 'image')) {
            $this->generateBitmapThumbnail($file);
        } elseif (Str::endsWith($this->getAttribute('type'), 'pdf')) {
            $this->generatePdfThumbnail($file);
        }
    }

}
