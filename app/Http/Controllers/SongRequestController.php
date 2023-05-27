<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\SongRequests\Create;
use App\Http\Requests\SongRequests\SetPlayed;

use App\Models\SongRequest;

class SongRequestController extends Controller
{
    public function create(Create $request){
        $sr = new SongRequest($request->all());
        $sr->save();
        return response()->json(['id' => $sr->id], 200);
    }

    public function get_next(Request $request){
        $sr = SongRequest::where('played', false)->take(1)->first();
        return response()->json($sr, 200);
    }

    public function set_played(SetPlayed $request){
        $sr = SongRequest::where('id', $request->id)->first();
        $sr->fill(['played' => true]);
        $sr->save();
    }
}
