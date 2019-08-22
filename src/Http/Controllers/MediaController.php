<?php

namespace Maelstrom\Http\Controllers;

use Exception;
use Maelstrom\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class MediaController
 * @package Maelstrom\Http\Controllers
 */
class MediaController extends Controller
{

    /**
     * Which disk will the media be stored on
     *
     * @var string
     */
    public $disk = 'public';

    /**
     * A list of mime types which are allowed.
     *
     * @var array
     */
    public $mimeTypes = [
        'image/svg',
        'image/png',
        'image/jpeg',
        'application/pdf',
    ];

    /**
     * @var Media
     */
    public $query;

    /**
     * MediaController constructor.
     * @throws BindingResolutionException
     */
    public function __construct()
    {
        if (!config('maelstrom.media_manager.enabled')) {
            return abort(404);
        }

        $this->middleware(config('maelstrom.media_manager.middleware'));

        $this->disk = config('maelstrom.media_manager.disk');
        $this->mimeTypes = config('maelstrom.media_manager.mime_types');
        $this->query = app()->make(config('maelstrom.media_manager.model'))->newQuery();
    }

    /**
     * Display a listing of the resource.
     *
     * @return Collection|Media[]
     */
    public function index(Request $request)
    {
        if (!empty($ids = $request->get('ids', []))) {
            $this->query->whereIn('id', $ids);
        }

        return $this->query->orderByDesc('created_at')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Media
     * @throws BindingResolutionException
     * @throws \ImagickException
     */
    public function store(Request $request)
    {
        if (!$request->has('file')) {
            return abort(400, 'No file found');
        }

        $file = $request->file('file');

        if (!in_array($file->getMimeType(), $this->mimeTypes)) {
            return abort(422, 'Blacklisted file type of ' . $file->getMimeType());
        }

        /* @var Media $media */
        $media = app()->make(config('maelstrom.media_manager.model'));
        $media->setAttribute('name', $file->getClientOriginalName());
        $media->setAttribute('type', $file->getMimeType());
        $media->setAttribute('size', $file->getSize());
        $media->setAttribute('path', $file->storeAs(null, $media->guessFileName($file), ['disk' => $this->disk]));
        $media->setAttribute('cached_url', Storage::disk($this->disk)->url($media->getAttribute('path')));
        $media->setAttribute('dimensions', $media->extractDimensions($file));
        $media->generateThumbnail($file);

        $media->save();

        return $media;
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return Media
     */
    public function show($id)
    {
        return $this->query->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param $id
     * @return Media
     * @throws \ImagickException
     */
    public function update(Request $request, $id)
    {
        /* @var $media Media */
        $media = $this->query->findOrFail($id);

        if ($request->has('file')) {
            $file = $request->file('file');

            if (!in_array($file->getMimeType(), $this->mimeTypes)) {
                return abort(422, 'Blacklisted file type of ' . $file->getMimeType());
            }

            $media->setAttribute('type', $file->getMimeType());
            $media->setAttribute('size', $file->getSize());
            $media->setAttribute('path', $file->storeAs(null, $media->guessFileName($file), $this->disk));
            $media->setAttribute('cached_url', Storage::disk($this->disk)->url($media->getAttribute('path')));
            $media->setAttribute('dimensions', $media->extractDimensions($file));
            $media->generateThumbnail($file);
        }

        $media->setAttribute('name', $request->input('name', $media->getAttribute('name')));
        $media->setAttribute('alt', $request->input('alt'));
        $media->setAttribute('description', $request->input('description'));
        $media->setAttribute('tags', $request->input('tags'));

        $media->save();

        return $media;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return void
     * @throws Exception
     */
    public function destroy($id)
    {
        /* @var $media Media */
        $media = $this->query->findOrFail($id);

        $media->delete();

        return response([
            'success' => true
        ]);
    }
}
