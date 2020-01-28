<?php

namespace Maelstrom;

use Closure;
use Exception;
use ReflectionClass;
use ReflectionException;
use Illuminate\View\View;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Intervention\Image\Image;
use Illuminate\Routing\Router;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Constraint;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\FileBag;
use Intervention\Image\Facades\Image as Intervention;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Container\BindingResolutionException;

class Panel
{
    /**
     * When displaying the name of resource, we use this field.
     *
     * @var string
     */
    public $nameField = 'name';

    /**
     * This houses the name of the entity to display, e.g. "User"
     * We try calculate this from the class name if you don't supply one.
     *
     * @var string
     */
    public $entityName;

    /**
     * An instance of the query builder for the provided model,
     * this is what all the queries are executed against.
     *
     * @var Builder
     */
    public $query;

    /**
     * When editing - this is populated with the
     * entry via the setEntry() method - When it's empty
     * we assume we're not editing.
     *
     * @var Model
     */
    public $entry;

    /**
     * An instance of the Illuminate request,
     * this houses things such as active filters, uploaded files etc.
     * We do modify this occasionally so if you also need to mutate it
     * make sure you use the instance on the panel e.g. $panel->request
     *
     * @var Request
     */
    public $request;

    /**
     * When on the index page or in the trash, this is how many
     * items will show per page.
     * It's over written via the "per_page" query string.
     *
     * @var int
     */
    public $perPage = 10;

    /**
     * When populated is an object containing a column and search query via the query string "search".
     *
     * { "query": "mr jones", "column" => "name" }
     *
     * @var object|null
     */
    public $search = null;

    /**
     * When populated is an object of filters that are enabled via the query string "filters".
     *
     * { "category.name": [2], "year": [2003] }
     *
     * Filtering of the query must be handled by you via the setFilterHandler() method.
     *
     * @var object|null
     */
    public $filters = null;

    /**
     * When populated is an object containing the sorting configuration via the query string "sort"
     *
     * { "column": "name", "direction" => "ascend" }
     *
     * @var object|null
     */
    public $sort = null;

    /**
     * When no sort order is defined via the query string, you can fall back to a default
     * sorting, which is defined by ->setDefaultSorting('name', 'desc')
     *
     * @var string|null
     */
    public $defaultSortColumn = null;

    /**
     * Sets the direction of ordering when using ->setDefaultSorting();
     *
     * @var string
     */
    public $defaultSortDirection = 'ASC';

    /**
     * If this is set to true - the queries get scoped
     * to only showing the items in the trash. Normally only used
     * when the model uses the SoftDeletes trait.
     *
     * @var bool
     */
    public $inTrash = false;

    /**
     * Flags if this entity uses the SoftDeletes trait,
     * if it doesn't - then certain features are hidden like the trash.
     *
     * @var bool
     */
    public $isTrashable = false;

    /**
     * This contains an index of all the named
     * routes for the entity e.g. "page.update".
     *
     * @var array
     */
    public $routes;

    /**
     * As filter logic is unique to each database structure, you must create the filter
     * logic yourself, we pass you all the data you need once you define a setFilterHandler().
     *
     * @var Closure|null
     */
    public $filterHandler = null;

    /**
     * We provide basic "LIKE" search - however if you need a more advance search
     * you can provide one via the setSearchHandler method.
     *
     * @var Closure|null
     */
    public $searchHandler = null;

    /**
     * We provide a simple file uploader, however if you need more configuration
     * you can define your own via setUploadHandler.
     *
     * @var Closure|null
     */
    public $uploadHandler = null;

    /**
     * We provide a simple image manipulator, however if you need more configuration
     * you can define your own via setImageProcessingHandler.
     *
     * @var Closure|null
     */
    public $imageProcessingHandler = null;

    /**
     * You can define a one-off hook to execute before
     * the data is passed to the save methods allowing you a final
     * opportunity to manipulate data.
     *
     * @var Closure|null
     */
    public $beforeSave;

    /**
     * When building the index page and displaying the table, you might want to show
     * customised or specific data in the tables, you can provide a data transformer which
     * takes each model and returns the data you want to display on the table.
     *
     * It's common to use a Laravel Resource to do this via the setEntriesTransformer method.
     *
     * @var Closure|null
     */
    public $entriesTransformer = null;

    /**
     * Any names of relationships defined here will be eager loaded
     * on the index page. e.g. $panel->setEagerLoad(['categories', 'tags'])
     *
     * @var array
     */
    public $eagerLoad = [];

    /**
     * Sometimes a full entry transformer is overkill, and you just want some
     * extra attributes added before the view is rendered, this is useful if you have
     * accessors that you want to add to the serialisation process e.g.
     *
     * $category->post_count = $category->posts()->count();
     *
     * @var array
     */
    public $with = [];

    /**
     * A key/value map defined via setRelationships(), this maps the name
     * of posted data to the name of a relationship method
     *
     * e.g. "category_id" => "category" will populate any data within the $request->get('category_id')
     * into the relationship "category()" on your model.
     *
     * @var array
     */
    public $relationships = [];

    /**
     * Contains mapping of form fields to upload configurations. e.g.
     *
     * setUploadables([
     *     'avatar' => [
     *          'disk' => 'public',
     *          'path' => 'avatars',
     *          'resize' => [400, 400],
     *          'crop' => [400, 400],
     *     ],
     *     'gallery' => [
     *          'disk' => 'public',
     *          'path' => '',
     *          'resize' => [2000, 2000],
     *          'crop' => false,
     *     ]
     *     'downloads' => [
     *          'disk' => 'public',
     *          'path' => 'files',
     *     ]
     * ]);
     *
     * @var array
     */
    public $uploadables = [];

    /**
     * When a file has been uploaded during the "update" or "store"
     * process, we cache them into this array for retrieval.
     *
     * It contains the final saved path of the uploaded file.
     *
     * @var array
     */
    public $uploaded = [];

    /**
     * Can be used to house the index table heading configuration.
     * This is optional, just make sure you pass a $columns to the table component.
     *
     * @var array
     */
    public $tableHeadings = [];

    /**
     * Stores the start of the breadcrumb trail, e.g if you have an admin area
     * that you want all breadcrumbs prefixed with you can set it here.
     *
     * By default you can set this in the maelstrom.php config in the following format.
     *
     * [
     *    [ "label" => "Maelstrom", "route" => "/" ],
     *    [ "label" => "Admin", "route" => "/admin" ]
     * ]
     *
     * @var array
     */
    public $breadcrumbRoot = [];

    /**
     * @param Builder|string $model
     * @param Request $request
     * @throws BindingResolutionException
     */
    public function __construct($model, Request $request = null)
    {
        $this->request = $request ?: request();

        $this
            ->setupModel($model)
            ->setupQueryStrings()
            ->setupEntityName()
            ->setupRoutes()
            ->setupTrash()
            ->setupBreadcrumbs();

        app()->instance('maelstrom', $this);
    }

    /**
     * Takes either an instance of the query builder from a model
     * or the name of a class to instantiate e.g. App\Page::class
     * All queries/logic will hang of this model.
     *
     * @param $modelOrQueryBuilder
     * @return Panel
     * @throws BindingResolutionException|InvalidArgumentException
     */
    public function setupModel($modelOrQueryBuilder): Panel
    {
        if (is_a($modelOrQueryBuilder, Builder::class)) {
            $this->query = $modelOrQueryBuilder;
        } elseif (class_exists($modelOrQueryBuilder)) {
            $this->query = app()->make($modelOrQueryBuilder)->query();
        } else {
            throw new InvalidArgumentException($modelOrQueryBuilder . ' must be an Eloquent model or Query builder instance.');
        }

        return $this;
    }

    /**
     * Configures and parses the query strings for various things such
     * as filters, items per page etc.
     *
     * @return $this
     */
    public function setupQueryStrings(): Panel
    {
        $this->perPage = (int)$this->request->get('per_page', $this->perPage);
        $this->search = $this->request->has('search') ? json_decode($this->request->get('search')) : null;
        $this->sort = $this->request->has('sort') ? json_decode($this->request->get('sort')) : null;
        $this->filters = $this->request->has('filters') ? json_decode($this->request->get('filters')) : null;
        $this->inTrash = $this->request->has('in_trash');

        return $this;
    }

    /**
     * Sets the entity name automatically to the class name
     * however, to overwrite this just call setEntityName() yourself.
     *
     * @return $this
     */
    public function setupEntityName(): Panel
    {
        try {
            $name = get_class($this->query->getModel());
            $this->entityName = (new ReflectionClass($name))->getShortName();
        } catch (Exception $exception) {
            // ... oh well.
        }

        return $this;
    }

    /**
     * Tries to guess the route mapping from the class name.
     * This is unlikely to be write for a lot of the time.
     * So just call setRoutes() yourself if you need.
     *
     * @param null $prefix
     * @return $this
     */
    public function setupRoutes($prefix = null): Panel
    {
        $prefix = $prefix ?: mb_strtolower(Str::plural($this->entityName, 2));

        // If we cannot find the above route, we try finding an alternative one,
        // If neither of these work, you should just call `setupRoutes()` yourself with the correct prefix.
        if (!Route::has($prefix . '.index')) {
            $prefix = mb_strtolower($this->entityName);
        }

        $this->routes = [
            'index' => $prefix . '.index',
            'show' => $prefix . '.show',
            'create' => $prefix . '.create',
            'store' => $prefix . '.store',
            'edit' => $prefix . '.edit',
            'update' => $prefix . '.update',
            'destroy' => $prefix . '.destroy',
            'bulk' => $prefix . '.bulk',
        ];

        return $this;
    }

    /**
     * Attempts to enable the withTrashed model scope if needed.
     *
     * @return $this
     */
    public function setupTrash(): Panel
    {
        try {
            // Make sure we only allow trashing if the model has SoftDeletes trait.
            $this->isTrashable = method_exists($this->query->getModel(), 'trashed');
            $this->applyTrashScope();
        } catch (Exception $exception) {
            dd($exception->getMessage());
        }

        return $this;
    }

    /**
     * Sets the initial breadcrumb root.
     *
     * @return $this
     */
    public function setupBreadcrumbs(): Panel
    {
        $this->setBreadcrumbRoot(config('maelstrom.breadcrumb'));

        return $this;
    }

    /**
     * Allows you to handle the uploads yourself, if you provide a handler
     * "handleUploadables()" will not get called.
     *
     * Your closure will receive:
     *
     * closure($files, $uploadMappings, $entry, $panel)
     *
     * You just need to pass back an array of uploaded paths to save in the database.
     *
     * @param $handler
     * @return Panel
     */
    public function setUploadHandler($handler): Panel
    {
        $this->uploadHandler = $handler;

        return $this;
    }

    /**
     * If you want a custom image processor uploading, you can pass a closure
     * in here and we'll execute this instead of "handleUploadedImage".
     *
     * You just need to return back the Image instance itself once you're done.
     *
     * @param $handler
     * @return Panel
     */
    public function setImageProcessingHandler($handler): Panel
    {
        $this->imageProcessingHandler = $handler;

        return $this;
    }

    /**
     * Defines the function which should be used to filter the
     * entries for the index page.
     *
     * @param Closure $handler
     * @return Panel
     */
    public function setFilterHandler(Closure $handler): Panel
    {
        $this->filterHandler = $handler;

        return $this;
    }

    /**
     * This isn't used by default - but if you need a custom search
     * handler, you can define one here.
     *
     * @param Closure $handler
     * @return Panel
     */
    public function setSearchHandler(Closure $handler): Panel
    {
        $this->searchHandler = $handler;

        return $this;
    }

    /**
     * Sets the function which is used to transform each entry
     * before it is returned to the table on the index.
     *
     * @param Closure $transformer
     * @return Panel
     */
    public function setEntriesTransformer(Closure $transformer): Panel
    {
        $this->entriesTransformer = $transformer;

        return $this;
    }

    /**
     * Sets the default routes to display at the start of all breadcrumbs.
     *
     * @param array $routes
     * @return Panel
     */
    public function setBreadcrumbRoot(array $routes): Panel
    {
        $this->breadcrumbRoot = $routes;

        return $this;
    }

    /**
     * Defines the relationships to use during "handleRelationships". Should be a mapping of
     * request field name -> relationship method on the model. e.g.
     *
     * setRelationships([
     *      'category_id' => 'category',
     *      'tags' => 'tags',
     * ])
     *
     * Will eventually execute:
     *
     * $entry->category()->associate($request->get('category_id'))
     *
     * and
     *
     * $entry->tags()->sync($request->get('tags'))
     *
     * @param array $relationships
     * @return Panel
     */
    public function setRelationships(array $relationships = []): Panel
    {
        $this->relationships = $relationships;

        return $this;
    }

    /**
     * Defines the relationships to eager load on the index page.
     *
     * @param array $relationships
     * @return Panel
     */
    public function setEagerLoad(array $relationships): Panel
    {
        $this->eagerLoad = $relationships;

        return $this;
    }

    /**
     * Defines which attributes should be attached to the model when serialising.
     *
     * @param array $attributes
     * @return Panel
     */
    public function setWithAttributes(array $attributes): Panel
    {
        $this->with = $attributes;

        return $this;
    }

    /**
     * Defines the currently active entry, normally you call this
     * at the start of your edit methods to load the model into Maelstrom.
     *
     * @param Model $entry
     * @return Panel
     */
    public function setEntry(Model $entry): Panel
    {
        $this->entry = $entry;

        return $this;
    }

    /**
     * Sets how many items per page should be displayed.
     *
     * @param int $perPage
     * @return Panel
     */
    public function setPerPage(int $perPage): Panel
    {
        $this->perPage = $perPage;

        return $this;
    }

    /**
     * Stores the configuration mapping for your uploadables.
     * Only fields defined in here will get excluded from basic casting
     * to the database on save, if you don't define them here likely
     * your database will end up with paths such as "/tmp/php/dhHytsoqk23jd" inside.
     *
     * It should be used in a way similar to
     *
     * setUploadables([
     *     'avatar' => [
     *          'disk' => 'public',
     *          'path' => 'avatars',
     *          'resize' => [400, 400],
     *          'crop' => [400, 400],
     *     ],
     *     'gallery' => [
     *          'disk' => 'public',
     *          'path' => '',
     *          'resize' => false,
     *          'crop' => false,
     *     ]
     *     'downloads' => [
     *          'disk' => 'public',
     *          'path' => 'files',
     *     ]
     * ]);
     *
     * @param array $uploadables
     * @return Panel
     */
    public function setUploadables(array $uploadables): Panel
    {
        $this->uploadables = $uploadables;

        return $this;
    }

    /**
     * If the route guessing doesn't work you can define them explicitly.
     *
     * @param $routes
     * @return $this
     */
    public function setRoutes($routes): Panel
    {
        $this->routes = $routes;

        return $this;
    }

    /**
     * Sets which attribute should be used as the main name of a single entity.
     *
     * @param string $nameField
     * @return Panel
     */
    public function setNameField(string $nameField): Panel
    {
        $this->nameField = $nameField;

        return $this;
    }

    /**
     * Allows you to set the default sorting direction for a panel.
     *
     * @param string $column
     * @param string $direction
     * @return Panel
     */
    public function setDefaultSorting(string $column, string $direction = 'asc'): Panel
    {
        $this->defaultSortColumn = $column;
        $this->defaultSortDirection = strtoupper($direction);

        return $this;
    }

    /**
     * Allows you to explicitly define the name of the entity you're using.
     * You should always provide the singular version e.g. "Page" NOT "Pages"
     *
     * When you request back the entity name via "getEntityName" you have the option
     * to pluralise it then.
     *
     * @param string $entityName
     * @return Panel
     */
    public function setEntityName(string $entityName): Panel
    {
        $this->entityName = $entityName;

        return $this;
    }

    /**
     * Allows you to define all the table headings for the index view.
     *
     * This is optional - However just make sure you provide $columns to the table component.
     *
     * @param array $tableHeadings
     * @return Panel
     */
    public function setTableHeadings(array $tableHeadings): Panel
    {
        $this->tableHeadings = $tableHeadings;

        return $this;
    }

    /**
     * A simple helper function which takes the entity named defined
     * by "setEntityName" and either returns it, or pluralises it.
     *
     * Used on various things such as breadcrumbs, page titles etc.
     *
     * @param bool $asPlural
     * @return string
     */
    public function getEntityName(bool $asPlural = false): string
    {
        // 4 is just a random number, if you don't know which version
        // to display you can do something like $panel->getEntityName($entries->count() > 1)
        if ($asPlural) {
            return Str::plural($this->entityName, 4);
        }

        return $this->entityName;
    }

    /**
     * Returns a list of the user defined breadcrumbs with the root
     * breadcrumbs appended to the start.
     *
     * @param array $crumbs
     * @return array
     */
    public function getBreadcrumbs(array $crumbs = []): array
    {
        // Makes sure the start of the breadcrumbs always contains
        // the same thing! e.g. /admin/
        $crumbs = array_merge($this->breadcrumbRoot, $crumbs);

        return $crumbs;
    }

    /**
     * If we've loaded an entry via setEntry() e.g. on the edit page
     * then we can get an instance of the entry back.
     *
     * If we haven't this will return null - so we know if we're editing or not.
     *
     * @return Model
     */
    public function getEntry(): ?Model
    {
        return $this->entry;
    }

    /**
     * If an entry is loaded, it will return the primary key for it.
     *
     * @return string|null
     */
    public function getEntryId(): ?string
    {
        // We return a string, which is easier for the JS to handle
        // it also then supports UUIDs
        if ($this->getEntry()) {
            return (string) $this->getEntry()->getKey();
        }

        return null;
    }

    /**
     * Displays the name of the entry as defined by the $this->nameField
     * used in places such as the page title when editing.
     *
     * @return string|null
     */
    public function getEntryName(): ?string
    {
        // Only if an entry exists do we return it!
        if ($this->getEntry()) {
            return data_get($this->getEntry(), $this->getNameField(), null);
        }

        return null;
    }

    /**
     * Returns a list of entries for the table view,
     * it applies all eager loaded relationships, sorting, filtering etc.
     *
     * @return LengthAwarePaginator
     */
    public function getEntries(): LengthAwarePaginator
    {
        return $this
            ->applyRelationships()
            ->applySearchQuery()
            ->applySorting()
            ->applyFilters()
            ->applyPagination();
    }

    /**
     * The straight forward getter to return the defined eager loaded relationships from setEagerLoad.
     *
     * Everything stored within here will get attached to the getEntries query.
     *
     * @return array
     */
    public function getEagerLoad(): array
    {
        return $this->eagerLoad;
    }

    /**
     * The straight forward getter to return the defined relationships from setRelationships.
     *
     * Everything stored within here will get mapped up during "handleRelationships()"
     *
     * @return array
     */
    public function getRelationships(): array
    {
        return $this->relationships;
    }

    /**
     * Returns a fully resolved URL for a default resourceful controller route.
     *
     * @param string $action
     * @param $entry
     * @return string
     */
    public function getRoute(string $action, $entry = null): string
    {
        if (!Route::has($this->routes[$action])) {
            return '';
        }

        // We only know these ones should really exist,
        // any custom ones you need you can append yourself to extend this function.
        if (in_array($action, ['show', 'update', 'destroy', 'edit'])) {
            return route($this->routes[$action], $entry ?: $this->getEntry());
        } else {
            return route($this->routes[$action]);
        }
    }

    /**
     * Returns an array of routes pre-populated for each entry.
     * We do this in PHP as the javascript doesn't know where to go.
     *
     * @param $entry
     * @return array
     */
    public function getRoutes($entry = 'placeholder'): array
    {
        $routes = [];

        // This goes around each named route e.g. "page.edit"
        // and resolves the full route for the entry.
        foreach ($this->routes as $action => $path) {
            $routes[$action] = $this->getRoute($action, $entry);
        }

        return array_filter($routes);
    }

    /**
     * Returns an array of data from the POST/PUT request
     * it only extracts data from the request which has been defined
     * as $fillable on the model. So if you're one of those crazy people who
     * like to un-guard everything, there's no place for you here.
     *
     * If any uploaded files have been attached, it also merges those into the data.
     *
     * @return array
     */
    public function getFillableData(): array
    {
        $data = $this->request->only(
            $this->query->getModel()->getFillable()
        );

        // Uploads get handled in handleUploadables() - this just returns an array of paths
        // to save into the database.
        foreach ($this->getUploadables() as $key => $value) {
            if ($this->uploadHandler) {
                // We remove the key from the data otherwise you end up
                // saving temp file paths into the db like /tmp/H6hsgysn
                unset($data[$key]);
            } elseif (isset($data[$key])) {
                // We get the base file path for the file, without the disk information.
                $data[$key] = $this->getUploadedFiles($key, $data[$key]);
            }
        }

        // If we have repeatable fields, we need to convert
        // their json representation into an array for storage.
        $encoded = $this->request->get('_encoded', []);

        // Go around all the fields we've provided,
        // see if the field has been defined as a repeater
        // if it has, then json decode it.
        foreach ($data as $field => $value) {
            if (in_array($field, $encoded)) {
                $data[$field] = json_decode($value, true);
            }
        }

        // If you have defined a hook to manipulate the data before
        // it goes to the ->fill() method.
        if ($this->beforeSave && $finalData = call_user_func($this->beforeSave, $data)) {
            $data = $finalData;
        }

        return $data;
    }

    /**
     * The straight forward getter to return the defined attributes to append from setWithAttributes();
     *
     *
     * @return array
     */
    public function getWithAttributes(): array
    {
        return $this->with;
    }

    /**
     * Returns back the configuration mapping provided by "setUploadables()"
     *
     * @return array
     */
    public function getUploadables(): array
    {
        return $this->uploadables;
    }

    /**
     * Returns the raw path for an uploaded file by the field name in the request,
     * if it's an array of files you'll get a merged array of the old files with new files.
     *
     * e.g. it turns
     *
     * Request([
     *    "gallery": [
     *       UploadedFile,
     *       UploadedFile,
     *       "https://www.maelstrom-cms.com/storage/gallery/image3.jpg",
     *       "https://www.maelstrom-cms.com/storage/gallery/image4.jpg",
     *    ]
     * ])
     *
     * into
     *
     * Request([
     *    "gallery": [
     *      "storage/gallery/image1.jpg",
     *      "storage/gallery/image2.jpg",
     *      "storage/gallery/image3.jpg",
     *      "storage/gallery/image4.jpg",
     *   ]
     * ])
     *
     * @param $field
     * @param $data
     * @return array|string $mixed
     */
    public function getUploadedFiles(string $field, $data)
    {
        // We pull out the original value for the attribute without any accessors
        // this could be a string or stringified json.
        $original = $this->getEntry() ? $this->getEntry()->getOriginal($field) : null;

        if (is_array($data)) {
            // Filter the data out to get only paths for existing files
            // otherwise we get UploadedFile in the array
            $data = array_filter($data, function ($item) {
                return is_string($item);
            });

            // If request payload successfully uploaded, it should exist
            // as it's an array we need to merge it in.
            if (isset($this->uploaded[$field])) {
                $data = array_merge($data, $this->uploaded[$field]);
            }

            if ($this->getEntry()) {
                // as we know we're dealing with an array, we decode the json
                // for existing items in the DB so we can replace.
                $original = Arr::wrap(json_decode($original, true));

                // This is a little awkward, but because the frontend needs full
                // URLs to display previews, we don't know where in the array the originals
                // are, we take a guess that if the URL ends with the same filename
                // as the DB, we assume its a match, so we replace the URL with the file path.
                $data = array_map(function ($path) use ($original) {
                    foreach ($original as $i) {
                        if (Str::endsWith($path, $i)) {
                            return $i;
                        }
                    }

                    return $path;
                }, $data);
            }

            // As we don't want to store an Object but an array, we need to reset the keys.
            return array_values($data);
        }

        // If this is a newly uploaded file, then we don't need to do anything
        // just return the new path for storage!
        if (isset($this->uploaded[$field])) {
            return $this->uploaded[$field];
        }

        // If it's a single file, then it should be a URL. We'll do a crude
        // check if it has a web protocol, as we don't want to save the full URL
        // in the database, if it thinks its the same file from getOriginal()
        // we put back in whatever was previously in the database.
        if ($this->getEntry()) {
            if (Str::startsWith($data, 'http') && Str::endsWith($data, $original)) {
                return $original;
            }
        }

        // If we couldn't find anything to do, we just give the data back untouched.
        return $data;
    }

    /**
     * Returns a list of columns from the db table.
     *
     * @return array
     */
    public function getColumns(): array
    {
        /** @noinspection PhpUndefinedMethodInspection */
        // This just checks the DB for what columns are on the model
        return Schema::getColumnListing(
            $this->query->getModel()->getTable()
        );
    }

    /**
     * Returns the name of the attribute used for the main name of a single entity.
     *
     * @return string
     */
    public function getNameField(): string
    {
        return $this->nameField;
    }

    /**
     * Returns how many items per page should be shown.
     *
     * @return int
     */
    public function getPerPage(): int
    {
        return (int) $this->perPage;
    }

    /**
     * If you've used setTableHeadings() then you can get them back!
     *
     * We call this within the index() method to define which headings to display on the table,
     * it normally populates the $columns variable for the index view.
     *
     * @return array
     */
    public function getTableHeadings(): array
    {
        return $this->tableHeadings;
    }

    /**
     * This effectively executes the final query
     * which returns the results after any transformations
     * have been applied.
     *
     * @return LengthAwarePaginator
     */
    public function applyPagination(): LengthAwarePaginator
    {
        return $this->applyTransformations(
            $this->query->paginate($this->perPage)
        );
    }

    /**
     * Here we apply the transformations to each entry that comes back
     * from the query.
     *
     * We use a custom one "panelRoutes" to know where to send things, however
     * if an additional transformer is supplied via setEntriesTransformer()
     * each item will get passed through this before returning it to the view.
     *
     * @param LengthAwarePaginator $pagination
     * @return LengthAwarePaginator
     */
    public function applyTransformations(LengthAwarePaginator $pagination): LengthAwarePaginator
    {
        /** @noinspection PhpUndefinedMethodInspection */
        $pagination->getCollection()->transform(function (Model $entry) {
            // Currently we only need this to enable the
            // table view to create a clickable item name which takes
            // you to the edit screen.
            if (!$entry->getAttribute('panelRoutes')) {
                $entry->setAttribute('panelRoutes', ['edit' => $this->getRoute('edit', $entry)]);
            }

            // We append any attributes that are needed for serialisation.
            foreach ($this->getWithAttributes() as $attribute) {
                if (Str::contains($attribute, '.')) {
                    $entry->setAttribute($attribute, data_get($entry, $attribute));
                } else {
                    $entry->append($attribute);
                }
            }

            // Here we apply the transformation if you actually supplied one.
            if (method_exists($this, 'entriesTransformer')) {
                $entry = $this->entriesTransformer($entry);
            } elseif ($this->entriesTransformer) {
                $entry = call_user_func($this->entriesTransformer, $entry);
            }

            return $entry;
        });

        return $pagination;
    }

    /**
     * Applies any default filters such as trash, then if a filter handler
     * has been defined, will execute that allowing user provided filters to be applied.
     *
     * @return Panel
     */
    public function applyFilters(): Panel
    {
        if ($this->isTrashable && $this->inTrash) {
            /** @noinspection PhpUndefinedMethodInspection */
            $this->query->onlyTrashed();
        }

        // We don't handle any filtering apart from "trash" so you'll need to
        // take over here and provide a custom filter handler via "setFilterHandler()"
        if (method_exists($this, 'filterHandler')) {
            $this->filterHandler($this->filters, $this->query, $this->request);
        } elseif ($this->filters && $this->filterHandler) {
            call_user_func($this->filterHandler, $this->filters, $this->query, $this->request);
        }

        return $this;
    }

    /**
     * Takes what was defined by the $sort query string and applies
     * the ordering to the query.
     *
     * We check that the ordering is a valid db column to help prevent any
     * sql injection attempts, as well as manually passing in the direction.
     *
     * If you're going to overwrite this, we recommend you do the same.
     *
     * @return Panel
     */
    public function applySorting(): Panel
    {
        // We check the column exists on the DB to prevent sql injection
        if ($this->sort && $this->isValidColumn($this->sort->column)) {
            // We also manually mutate the sorting to make sure we don't pass
            // user submitted data into the query.
            $sortDirection = $this->sort->direction ?: $this->defaultSortDirection;
            $sortColumn = $this->sort->column ?: $this->defaultSortColumn;

            $this->query->orderBy($sortColumn, (in_array($sortDirection, ['asc', 'ASC', 'ascend']) ? 'ASC' : 'DESC'));
        } elseif ($this->defaultSortColumn) {
            $this->query->orderBy($this->defaultSortColumn, $this->defaultSortDirection);
        }

        return $this;
    }

    /**
     * Either applies the default search logic which uses a simple
     * LIKE query, or executes a previously defined searchHandler.
     *
     * @return Panel
     */
    public function applySearchQuery(): Panel
    {
        if ($this->search) {
            $column = mb_strtolower($this->search->column);

            // If you have a custom handler, we'll use that instead.
            if (method_exists($this, 'searchHandler')) {
                $this->searchHandler($this->search, $this->query, $this->filters, $this->request);
            } elseif ($this->searchHandler) {
                call_user_func($this->searchHandler, $this->search, $this->query, $this->filters, $this->request);
            } else {
                // A simple search on a local DB column, we just use LIKE here... if you need anything
                // more fancy then use a custom search handler to amend the query.
                if ($this->isValidColumn($column)) {
                    $this->query->where($column, 'LIKE', sprintf('%%%s%%', $this->search->query));
                }
            }
        }

        return $this;
    }

    /**
     * If we're trying to view a model which has the trait SoftDeletes
     * then the route/model binding will say the model doesn't exist
     * and throws a 404.
     *
     * However we'll still allow users to see it, with a small message to let them know,
     * but to do this we need to overwrite the route binding and add withTrashed()
     * so that it doesn't 404.
     *
     * @return $this
     */
    public function applyTrashScope(): Panel
    {
        if ($this->isTrashable) {
            /* @var $router Router */
            $router = app('router');

            // We have to check the router exists, because we could be in the CLI
            if ($current = $router->current()) {
                $params = $current->parameterNames();

                // We hope the last segment is the name of the param you're using.
                // this means something like...
                // .com/user/34 the param name will be "user" so your model route binding
                // the variable should be called $user.
                // Normally this will work.
                $paramName = end($params);

                // Once we know the name of the binding, we can overwrite the existing
                // ones with one that looks in the trash!
                $router->bind($paramName, function ($id) {
                    /** @noinspection PhpUndefinedMethodInspection */
                    return $this->query->withTrashed()->where($this->query->getModel()->getRouteKeyName(), $id)->first();
                });
            }
        }

        return $this;
    }

    /**
     * Attaches the defined relationships to eager load them
     *
     * This only runs on the getEntries() not getEntry().
     *
     * @return $this
     */
    public function applyRelationships(): Panel
    {
        if ($this->getEagerLoad()) {
            $this->query->with($this->getEagerLoad());
        }

        return $this;
    }

    /**
     * Lets you know if the current entry is in the trash or not.
     *
     * @return bool
     */
    public function isEntryTrashed(): bool
    {
        if ($this->getEntry() && $this->isTrashable) {
            /** @noinspection PhpUndefinedMethodInspection */
            return $this->getEntry()->trashed();
        }

        return false;
    }

    /**
     * Checks if the column exists on the model to help prevent sql injection.
     *
     * @param $column
     * @return bool
     */
    public function isValidColumn($column): bool
    {
        // You could always extend this class and run your own valid checks!
        // For now we just use the DB columns on the direct model.
        return in_array($column, $this->getColumns());
    }

    /**
     * Takes the mappings defined by "setRelationships" looks within the post request
     * for the fields that you've defined e.g "category_id" then it inserts the value
     * provided from the request into the associated relationship e.g. "category()".
     *
     * @return Panel
     * @throws ReflectionException
     */
    public function handleRelationships(): Panel
    {
        foreach ($this->getRelationships() as $field => $relationshipName) {
            $ids = $this->request->get($field);

            if (!method_exists($this->getEntry(), $relationshipName)) {
                dd('The relationship: ' . $relationshipName . ' does not exist on ' . get_class($this->query->getModel()));
            }

            /* @var $method BelongsToMany | BelongsTo */
            // We're just trying to find out what type of relationship this is
            // so that we can call the appropriate methods.
            $method = call_user_func([$this->getEntry(), $relationshipName]);
            $type = (new ReflectionClass($method))->getShortName();

            // We completely overwrite any existing relationships below.
            // over time this list might need adjusting!
            switch ($type) {
                case 'HasOne':
                case 'MorphOne':
                case 'HasOneThrough':
                    // Find all the props that start with the prefix e.g.
                    // prefix = "meta_" then it will find "meta_title".
                    $data = array_filter($this->request->all(), function ($property) use ($field) {
                        return Str::startsWith($property, $field);
                    }, ARRAY_FILTER_USE_KEY);

                    // Just removing the "meta_" prefix so it goes into the related model.
                    array_map(function ($value, $property) use (&$data, $field) {
                        unset($data[$property]);
                        $property = str_replace($field, '', $property);
                        $data[$property] = $value;
                    }, $data, array_keys($data));

                    $relation = $method->first() ?: $method->getRelated();
                    $relation->fill($data);

                    $method->save($relation);
                    break;
                case 'BelongsTo':
                    $method->associate($ids);
                    break;
                case 'BelongsToMany':
                case 'MorphMany':
                case 'MorphToMany':
                case 'MorphedByMany':
                    $method->sync($ids);
                    break;
                case 'HasMany':
                case 'HasManyThrough':
                    $items_to_associate = Arr::wrap($ids);

                    try {
                        // We were trying to unlink existing associations before providing new ones.
                        DB::transaction(function () use ($method) {
                            $method->update([$method->getForeignKeyName() => null]);
                        });
                    } catch (Exception $e) {
                        // Likely the field is not nullable so will need to be manually associated to something else.
                        logger()->warning($e->getMessage(), [$items_to_associate, $this->getEntry(), $method]);
                    }

                    if (!empty($items_to_associate)) {
                        $method->getRelated()
                            ->newQuery()
                            ->whereIn($method->getRelated()->getKeyName(), $items_to_associate)
                            ->update([
                                $method->getForeignKeyName() => $method->getParent()->getKey()
                            ]);
                    }
                    break;
                default:
                    dd('Unsupported relationship: ' . $type . ' on ' . get_class($this->getEntry()));
                    break;
            }

        }

        return $this;
    }

    /**
     * Provides access to some default basic bulk actions.
     *
     * @return bool|string
     * @throws Exception
     */
    public function handleBulkActions(): string
    {
        $action = $this->request->get('action');

        // This is an array of IDs to run the action against.
        $selected = $this->request->get('selected', []);
        $count = count($selected);

        // As this is bulk management, so if we can't loop, we ain't doing anything.
        if (!is_iterable($selected)) {
            return false;
        }

        $results = null;

        /*
         * When running bulk actions we loop around the models rather than mass deleting to make sure
         * that any eloquent or other events fire correctly for you.
         */

        switch ($action) {
            // Normal delete...
            case 'delete':
                foreach ($selected as $id) {
                    /** @noinspection PhpUndefinedMethodInspection */
                    if ($this->isTrashable) {
                        $this->query->getModel()->newQuery()->withTrashed()->find($id)->delete();
                    } else {
                        $this->query->getModel()->newQuery()->find($id)->delete();
                    }
                }

                $results = sprintf('%d %s deleted.', $count, Str::plural('item', $count));
                break;
            // Permanently delete - only available for SoftDeletes
            case 'perm_delete':
                foreach ($selected as $id) {
                    /** @noinspection PhpUndefinedMethodInspection */
                    $this->isTrashable && $this->query->getModel()->newQuery()->withTrashed()->find($id)->forceDelete();
                }

                $results = sprintf('%d %s permanently deleted.', $count, Str::plural('item', $count));
                break;
            // Restore soft deleted models - only available for SoftDeletes
            case 'restore':
                foreach ($selected as $id) {
                    /** @noinspection PhpUndefinedMethodInspection */
                    $this->isTrashable && $this->query->getModel()->newQuery()->withTrashed()->find($id)->restore();
                }

                $results = sprintf('%d %s restored.', $count, Str::plural('item', $count));
                break;
            default:
            // If no action was found above, we return false. So you can check that we did
            // nothing, if so you can then run your own custom bulk actions.
            return false;
        }

        $this->request->session()->flash('flash', [
            'type' => 'success',
            'message' => $results,
        ]);

        return $results;
    }

    /**
     * Runs only once, so that files are not uploaded twice.
     *
     * Will either execute your custom "uploadHandler" or...
     *
     * Loops around all of your defined uploadables via "setUploadables" and uploads them
     * to the defined disk within the config, if the file has an image mime type, then
     * it can be passed off to intervention for additional processing.
     *
     * The only updates the "$this->uploaded" array so you can use the data elsewhere.
     *
     * It only gets assigned back to the post data within the "getFillableData()"
     *
     * @return array
     */
    public function handleUploadables(): array
    {
        // To make sure we don't double upload, if it's already set we just return it.
        if (!empty($this->uploaded)) {
            return $this->uploaded;
        }

        // If you have defined a custom handler, we just let you execute that, but we make sure
        // the uploaded array is populated with your returned data.
        if (method_exists($this, 'uploadHandler')) {
            $this->uploadHandler($this->request->files, $this->uploadables, $this->getEntry(), $this);
        } elseif ($this->uploadHandler) {
            return $this->uploaded = call_user_func($this->uploadHandler, $this->request->files, $this->uploadables, $this->getEntry(), $this);
        }

        /* @var $files FileBag */
        foreach ($this->getUploadables() as $field => $_config) {
            $config = array_merge([
                'path' => '',
                'disk' => 'public',
            ], $_config);

            // Only do this if the field is populated with something
            if ($uploads = $this->request->files->get($field, null)) {
                // If we've got an array of files from a multi-uploader, it's more work.
                if (is_array($uploads)) {
                    $paths = [];

                    foreach ($uploads as $k => $upload) {
                        /* @var $file UploadedFile */
                        $file = $this->request->file($field . '.' . $k);

                        // If it's an image we pass off it's responsibility to the image handler.
                        if (Str::startsWith($file->getMimeType(), 'image')) {
                            $paths[] = $this->handleUploadedImage($file, $config);
                        } else {
                            $paths[] = $file->store($config['path'] ?? '', $config['disk']);
                        }
                    }

                    $this->uploaded[$field] = $paths;
                } else {
                    /* @var $file UploadedFile */
                    $file = $this->request->file($field);

                    // If it's an image we pass off it's responsibility to the image handler.
                    if (Str::startsWith($file->getMimeType(), 'image')) {
                        $this->uploaded[$field] = $this->handleUploadedImage($file, $config);
                    } else {
                        $this->uploaded[$field] = $file->store($config['path'] ?? '', $config['disk']);
                    }
                }
            }
        }

        return $this->uploaded;
    }

    /**
     * If the upload is an image, then we can allow for some additional processing.
     * You can overwrite the built in processing by using the "setImageProcessingHandler"
     * and passing in a closure to execute instead, once you pass back the Image.
     * We save it and move on!
     *
     * @param UploadedFile $file
     * @param $config
     * @return string
     */
    public function handleUploadedImage(UploadedFile $file, array $config = []): string
    {
        // If we don't have a custom config, just store and return the image path.
        if (!isset($config['resize']) && !isset($config['crop'])) {
            return $file->store($config['path'], $config['disk']);
        }

        /* @var $image Image */
        /** @noinspection PhpUndefinedMethodInspection */
        // Might need to be careful that users are not uploading 100mb images as your
        // server might run out of memory.
        $image = Intervention::make($file);

        // This is the custom defined handler by you.
        if (method_exists($this, 'imageProcessingHandler')) {
            $this->imageProcessingHandler($image, $config, $this->getEntry(), $this);
        } elseif ($this->imageProcessingHandler) {
            $image = call_user_func($this->imageProcessingHandler, $image, $config, $this->getEntry(), $this);
        } else {
            $image = $this->handleImageProcessing($image, $config);
        }

        // Save overwrites the file in /tmp/ on your OS, so when we save it we can still
        // store the image within the request as the path is the same! MAGIC!
        $image->save();

        return $file->store($config['path'], $config['disk']);
    }

    /**
     * A basic image processing method, takes an Image object provided by
     * Intervention, and a configuration. Can be used independently from
     * everything else as only uses the data passed in.
     *
     * It's only called if no custom image processor is defined, however if you want
     * to call it in your custom handler, you can do so e.g. $panel->handleImageProcessing($image, $config).
     *
     * @param $image
     * @param $config
     * @return Image
     */
    public function handleImageProcessing(Image $image, array $config): Image
    {
        // If we've provided a resize config item, then we'll resize the image
        // The format for the resize config is just
        //
        // $config['resize'] = [(int) $width, (int) $height]
        //
        if (isset($config['resize']) && is_array($config['resize'])) {
            list($width, $height) = $config['resize'];

            $image = $image->resize($width, $height, function (Constraint $c) {
                $c->aspectRatio();
                $c->upsize();
            });
        }

        // If we've provided a crop config item, then we'll crop the image
        // The format for the crop config is just
        //
        // $config['crop'] = [(int) $width, (int) $height]
        //
        if (isset($config['crop']) && is_array($config['crop'])) {
            list($width, $height) = $config['crop'];

            $image = $image->crop($width, $height);
        }

        return $image;
    }

    /**
     * Defines a single use hook which executes before the data is
     * returned to $entry->fill() - it gives you a final chance
     * to manipulate the data before it goes into the database.
     *
     * You get given a copy of the $data, an instance of the entry if it exists,
     * it might be null if you're not editing! you also get a copy of the request.
     * Finally we give you an instance of the whole panel just in case.
     *
     * Once you've made your changes you must return the $data back
     * otherwise you'll have nothing save.
     *
     * @param Closure $hook
     */
    public function beforeSave(Closure $hook)
    {
        $this->beforeSave = function ($data) use ($hook) {
            $this->beforeSave = null;

            if ($hook) {
                return call_user_func($hook, $data, $this->getEntry(), $this->request, $this);
            }

            return null;
        };
    }

    /**
     * A helper method to return the index view with
     * some basic data attached.
     *
     * You don't need to use this, but the default templates will
     * expect an $entries and $columns variable.
     *
     * @param $view
     * @return View
     */
    public function index(string $view): View
    {
        return view($view, [
            'entries' => $this->getEntries(),
            // You do not need to use "getTableHeadings()" however just make sure
            // you provide the "table" component with $columns.
            'columns' => $this->getTableHeadings()
        ]);
    }

    /**
     * A helper method to return the view for the create screen.
     *
     * Completely optional, but works for most basic use cases.
     *
     * @param $view
     * @param $formAction
     * @return View
     */
    public function create(string $view, $formAction = null): View
    {
        return view($view, [
            'action' => $formAction ?: $this->getRoute('store'),
            'method' => 'POST',
            'entry' => null,
        ]);
    }

    /**
     * A simple "store" helper which handles typical relationships and uploads.
     *
     * It also allows you to define a flash message on success.
     *
     * Feel free to extend, or create your version!
     *
     * @param string $successMessage
     * @return Model
     * @throws ReflectionException
     */
    public function store(string $successMessage = null): Model
    {
        $entry = $this->query->getModel();
        $this->setEntry($entry);

        // If you want to customise what data is saved
        // directly to this model, you can create a custom Panel
        // which extends this, and just overwrite the getFillableData() method.
        $entry->fill(
            $this->getFillableData()
        );

        $entry->save();

        $this->handleRelationships();

        $this->handleUploadables();

        $entry->save();

        if ($successMessage) {
            $this->request->session()->flash('flash', [
                'type' => 'success',
                'message' => $successMessage,
            ]);
        }

        return $this->getEntry();
    }

    /**
     * A helper method to return the view for the edit screen.
     *
     * Completely optional, but works for most basic use cases.
     *
     * @param $view
     * @param $formAction
     * @return View
     */
    public function edit($view, $formAction = null): View
    {
        return view($view, [
            'action' => $formAction ?: $this->getRoute('update'),
            'method' => 'PUT',
            'entry' => $this->getEntry(),
        ]);
    }

    /**
     * A simple "update" helper which handles typical relationships and uploads.
     *
     * It also allows you to define a flash message on success.
     *
     * Feel free to extend, or create your version!
     *
     * @param string $successMessage
     * @return Model
     * @throws ReflectionException
     */
    public function update(string $successMessage = null): Model
    {
        $entry = $this->getEntry();

        // If you want to customise what data is saved
        // directly to this model, you can create a custom Panel
        // which extends this, and just overwrite the getFillableData() method.
        $entry->fill(
            $this->getFillableData()
        );

        $this->handleRelationships();

        $this->handleUploadables();

        $entry->save();

        // We provide a "FlashAlert" component which automatically
        // looks for this variable to display a message.
        if ($successMessage) {
            $this->request->session()->flash('flash', [
                'type' => 'success',
                'message' => $successMessage,
            ]);
        }

        return $this->getEntry();
    }

    /**
     * A slightly naughty function for ease of use.
     *
     * This will delete the model that's associated with $this->setEntry()
     *
     * If the model passed in is already deleted, e.g. uses SoftDeletes and you
     * call the method again, it will restore it.
     *
     * @param string|null $successMessage
     * @return Model
     * @throws Exception
     */
    public function destroy(string $successMessage = null): Model
    {
        /** @noinspection PhpUndefinedMethodInspection */
        if ($this->isTrashable && $this->getEntry()->trashed()) {
            /** @noinspection PhpUndefinedMethodInspection */
            $this->getEntry()->restore();
        } else {
            $this->getEntry()->delete();
        }

        // We provide a "FlashAlert" component which automatically
        // looks for this variable to display a message.
        if ($successMessage) {
            $this->request->session()->flash('flash', [
                'type' => 'success',
                'message' => $successMessage,
            ]);
        }

        return $this->getEntry();
    }

    /**
     * If you need to return a redirect response for a specific route.
     *
     * @param $routeName
     * @return RedirectResponse|Redirector
     */
    public function redirect($routeName)
    {
        return redirect(
            $this->getRoute($routeName)
        );
    }

}
