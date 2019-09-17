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

if (!function_exists('is_json_string')) {
    /**
     * @param $string
     * @return bool
     */
    function is_json_string($string)
    {
        try {
            $decoded = json_decode($string);
        } catch (Exception $e) {
            return false;
        }

        if (!is_object($decoded) && !is_array($decoded)) {
            /*
            If our string doesn't produce an object or array
            it's invalid, so we should return false
            */
            return false;
        }

        /*
        If the following line resolves to true, then there was
        no error and our JSON is valid, so we return true.
        Otherwise it isn't, so we return false.
        */
        return json_last_error() === JSON_ERROR_NONE;
    }
}
