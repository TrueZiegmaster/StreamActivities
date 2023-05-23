<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

use App\Http\Controllers\SongRequestController;
Route::get('/sr/get-next', [SongRequestController::class, 'get_next']);
Route::post('/sr/create', [SongRequestController::class, 'create']);
Route::patch('/sr/set-played', [SongRequestController::class, 'set_played']);

use App\Http\Controllers\DAController;
Route::get('/donation_alerts/get-credentials', [DAController::class, 'get_credentials']);
