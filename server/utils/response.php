<?php

/**
 * @file utils/response.php
 * @description Standardized JSON response helper.
 *
 * All API responses follow a consistent envelope format:
 * {
 *   "success": bool,
 *   "message": string,
 *   "data":    mixed
 * }
 *
 * Calling json_response() always terminates execution via exit() —
 * no code after a response call will run.
 */

/**
 * Encodes and outputs a standard JSON API response, then exits.
 *
 * @param  bool   $success  Whether the operation succeeded.
 * @param  string $message  Human-readable status message.
 * @param  mixed  $data     Optional response payload (array, object, or empty array).
 * @return void             Always exits after output.
 */
function json_response($success, $message, $data = [])
{
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data,
    ]);
    exit();
}