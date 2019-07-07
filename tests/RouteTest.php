<?php

namespace Maelstrom\Tests;

use Illuminate\Support\Facades\Route;

class RouteTest extends BaseTestCase
{
    public function test_routes_get_registered()
    {
        $this->assertTrue(Route::has('maelstrom.form-options'));
        $this->assertTrue(Route::has('maelstrom.media.store'));
        $this->assertTrue(Route::has('maelstrom.media.index'));
        $this->assertTrue(Route::has('maelstrom.media.destroy'));
        $this->assertTrue(Route::has('maelstrom.media.show'));
        $this->assertTrue(Route::has('maelstrom.media.update'));
    }
}
