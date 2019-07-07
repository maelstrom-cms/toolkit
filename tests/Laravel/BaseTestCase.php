<?php

namespace Maelstrom\Tests;

use Orchestra\Testbench\TestCase;
use Maelstrom\Providers\MaelstromServiceProvider;

class BaseTestCase extends TestCase
{
    protected function getPackageProviders($app)
    {
        return [
            MaelstromServiceProvider::class,
        ];
    }
}
