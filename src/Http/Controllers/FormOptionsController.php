<?php

namespace Maelstrom\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Container\BindingResolutionException;

class FormOptionsController extends Controller
{
    /**
     * Stores the config items from "maelstorm.form_options"
     * normally looks a little something like:
     *
     * 'form_options' => [
     *     'categories' => [
     *        'model' => App\Category::class,
     *        'scopes' => [],
     *        'value' => 'id',
     *        'label' => 'name',
     *      ],
     * ]
     * @var array
     */
    public $types = [];

    /**
     * If the developer has defined some middleware to protect
     * the controller we load it here!
     */
    public function __construct()
    {
        if (!config('maelstrom.form_options.enabled')) {
            return abort(404);
        }

        $this->middleware(config('maelstrom.form_options.middleware'));
        $this->types = config('maelstrom.form_options.models');
    }

    /**
     * Single method controller, which fetches entities
     * if the type passed in exists within the config.
     *
     * @param $type
     * @return Collection
     * @throws BindingResolutionException
     */
    public function __invoke($type)
    {
        if (array_key_exists($type, $this->types)) {
            return $this->fetchFormOptions($type);
        }

        return abort(404, $type . ' cannot be found in options', $this->types);
    }

    /**
     * This is a fairly dumb method which simply
     * hopes you've provided an Eloquent model, then if
     * you've defined some scopes to allow adjusting the query
     * e.g. Only show models a user has access to it will attach them.
     * Then it will return all the entities and transform them into
     * a universal format for usage on the frontend.
     *
     * Oh it also sorts them alphabetically for improved usability.
     *
     * @param $type
     * @return Collection
     * @throws BindingResolutionException
     */
    public function fetchFormOptions($type)
    {
        $settings = $this->types[$type];

        /* @var $model Model */
        $model = app()->make($settings['model']);

        // Now we've got an instance of the query builder we can interact
        // with it via it's api to do things such as...
        $query = $model->newQuery();

        // Such as attach model scopes! for filtering/restricting results.
        if (isset($settings['scopes']) && is_array($settings['scopes'])) {
            $query->scopes($settings['scopes']);
        }

        // Return all the entries once they've been transformed into a sensible format.
        return $query->get()->transform(function ($item) use ($settings) {
            return [
                'value' => data_get($item, $settings['value']),
                'label' => data_get($item, $settings['label']),
            ];
        })->sortBy('label')->values();
    }
}
