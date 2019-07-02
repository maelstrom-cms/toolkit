<?php
if ($panel = $panel ?? maelstrom()) {
    if (!isset($method)) {
        $method = explode('@', app('router')->currentRouteAction());
        $method = end($method);
    }

    $routes = $panel->getRoutes();
    $name = $panel->getEntityName(true);
    $crumbs = $panel->getBreadcrumbs($crumbs ?? []);
} else {
    $method = '';
    $routes = [];
    $name = null;
    $crumbs = $crumbs ?? [];
} ?>
<div
    data-component="Breadcrumbs"
    data-method="{{ mb_strtolower($method) }}"
    data-routes='@json($routes)'
    data-entity-name="{{ $name }}"
    data-crumbs='@json($crumbs)'
>
</div>

