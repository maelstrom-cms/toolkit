<?php

Route::get('/maelstrom-api/form-options/{type}', \Maelstrom\Http\Controllers\FormOptionsController::class)->name('maelstrom.form-options');

Route::apiResource('/maelstrom-api/media', \Maelstrom\Http\Controllers\MediaController::class, [
    'as' => 'maelstrom',
]);
