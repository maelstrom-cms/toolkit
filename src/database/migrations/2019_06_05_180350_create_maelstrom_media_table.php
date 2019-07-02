<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMaelstromMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maelstrom_media', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('path');
            $table->string('thumbnail_path');
            $table->string('type')->nullable();
            $table->string('size')->nullable();
            $table->string('alt')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('cached_url');
            $table->string('cached_thumbnail_url');
            $table->longText('versions')->nullable();
            $table->text('description')->nullable();
            $table->longText('tags')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maelstrom_media');
    }
}
