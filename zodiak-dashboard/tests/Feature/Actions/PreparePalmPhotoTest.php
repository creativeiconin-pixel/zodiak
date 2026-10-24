<?php

namespace Tests\Feature\Actions;

use App\Actions\PreparePalmPhoto;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;
use Tests\TestCase;

class PreparePalmPhotoTest extends TestCase
{
    public function test_large_photo_is_shrunk_to_a_jpeg(): void
    {
        $upload = UploadedFile::fake()->image('palm.png', 3000, 2000);

        $prepared = (new PreparePalmPhoto)->handle($upload->getContent(), 'image/png');

        $this->assertSame('image/jpeg', $prepared['mediaType']);
        [$width, $height, $type] = getimagesizefromstring($prepared['data']);
        $this->assertSame(IMAGETYPE_JPEG, $type);
        $this->assertSame(PreparePalmPhoto::MAX_SIDE, max($width, $height));
    }

    public function test_bytes_that_are_not_an_image_are_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new PreparePalmPhoto)->handle('not an image at all', 'image/jpeg');
    }
}
