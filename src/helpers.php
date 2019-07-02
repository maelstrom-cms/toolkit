<?php

use Maelstrom\Panel;

if (!function_exists('bool_to_string')) {
    /**
     * Converts a true/falsy variable into a
     * string for JSON.parse later.
     *
     * @param $value
     * @return string
     */
    function bool_to_string($value) {
        return $value ? 'true' : 'false';
    }
}

if (!function_exists('maelstrom')) {
    /**
     * Returns a singleton instance of the currently
     * instantiated Panel.
     *
     * @param null $model
     * @param string $panel
     * @return Panel
     * @throws Exception
     */
    function maelstrom($model = null, string $panel = null) {
        try {
            if ($model) {
                $panel = $panel ?: config('maelstrom.panel');
                $query = is_string($model) ? app()->make($model)->query() : $model;

                app()->makeWith($panel, [
                    'model' => $query,
                ]);
            }

            return app()->make('maelstrom');
        } catch(Exception $exception) {
            return null;
        }
    }
}
