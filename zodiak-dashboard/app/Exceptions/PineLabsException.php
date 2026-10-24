<?php

namespace App\Exceptions;

use Exception;

/**
 * A Pine Labs Online API call failed. The message is safe to show to Op-Center staff (it never contains credentials).
 */
class PineLabsException extends Exception {}
