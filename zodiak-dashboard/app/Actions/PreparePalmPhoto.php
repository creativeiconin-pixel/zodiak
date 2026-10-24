<?php

namespace App\Actions;

use Imagick;
use ImagickException;
use InvalidArgumentException;

/**
 * Turns an uploaded palm photo into an image Claude can read, entirely in memory.
 *
 * Phones may send HEIC or very large photos; Claude accepts JPEG, PNG and WebP up to about 5 MB.
 * Re-encoding also strips EXIF data such as GPS location before the photo leaves the server.
 */
class PreparePalmPhoto
{
    public const MAX_SIDE = 1600;

    private const SUPPORTED = ['image/jpeg', 'image/png', 'image/webp'];

    private const PASS_THROUGH_BYTES = 3_500_000;

    /**
     * @return array{data: string, mediaType: string}
     *
     * @throws InvalidArgumentException When the photo cannot be opened.
     */
    public function handle(string $bytes, string $mediaType): array
    {
        if (extension_loaded('imagick')) {
            return $this->reencode($bytes);
        }

        if (in_array($mediaType, self::SUPPORTED, true) && strlen($bytes) <= self::PASS_THROUGH_BYTES) {
            return ['data' => $bytes, 'mediaType' => $mediaType];
        }

        throw new InvalidArgumentException('This photo format cannot be opened on this server.');
    }

    /**
     * @return array{data: string, mediaType: string}
     */
    private function reencode(string $bytes): array
    {
        try {
            $image = new Imagick;
            $image->readImageBlob($bytes);
            $image->setIteratorIndex(0);
            $this->orientUpright($image);

            if (max($image->getImageWidth(), $image->getImageHeight()) > self::MAX_SIDE) {
                $image->resizeImage(self::MAX_SIDE, self::MAX_SIDE, Imagick::FILTER_LANCZOS, 1, true);
            }

            $image->stripImage();
            $image->setImageFormat('jpeg');
            $image->setImageCompressionQuality(85);
            $data = $image->getImageBlob();
            $image->clear();
        } catch (ImagickException $exception) {
            throw new InvalidArgumentException('This photo could not be opened.', previous: $exception);
        }

        return ['data' => $data, 'mediaType' => 'image/jpeg'];
    }

    /**
     * Phone cameras save the photo sideways and record the rotation in EXIF, which is stripped later.
     */
    private function orientUpright(Imagick $image): void
    {
        match ($image->getImageOrientation()) {
            Imagick::ORIENTATION_BOTTOMRIGHT => $image->rotateImage('#000', 180),
            Imagick::ORIENTATION_RIGHTTOP => $image->rotateImage('#000', 90),
            Imagick::ORIENTATION_LEFTBOTTOM => $image->rotateImage('#000', -90),
            default => null,
        };

        $image->setImageOrientation(Imagick::ORIENTATION_TOPLEFT);
    }
}
