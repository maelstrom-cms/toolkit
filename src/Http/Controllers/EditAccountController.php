<?php

namespace Maelstrom\Http\Controllers;

use Maelstrom\Panel;
use ReflectionException;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Auth\Authenticatable;

class EditAccountController extends Controller
{
    /**
     * @var Panel
     */
    public $panel;

    /**
     * @var Authenticatable
     */
    public $user;

    /**
     * EditAccountController constructor.
     */
    public function __construct()
    {
        if (!config('maelstrom.auth.enabled')) {
            return abort(404);
        }

        $this->middleware(config('maelstrom.auth.middleware'));

        $this->middleware(function ($request, $next) {
            $this->user = auth(config('maelstrom.auth.guard'))->user();
            $this->panel = maelstrom(config('maelstrom.auth.model'));
            $this->panel->setEntry($this->user);

            return $next($request);
        });
    }

    /**
     * Just displays a basic form.
     *
     * @return View
     */
    public function __invoke()
    {
        return $this->panel->edit('maelstrom::templates.edit-account', route('maelstrom.edit-account'));
    }

    /**
     * @param Request $request
     * @return View
     * @throws ReflectionException
     */
    public function update(Request $request)
    {
        $this->validate($request);

        $this->doUpdate();

        $this->updatePassword($request);

        return $this->__invoke();
    }

    public function validate(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique($this->panel->query->getModel()->getTable(), 'email')->ignore($this->panel->getEntryId(), $this->panel->query->getModel()->getKeyName())],
        ]);
    }

    public function doUpdate()
    {
        $this->panel->update('Profile updated');
    }

    public function updatePassword(Request $request)
    {
        if ($request->has('new_password')) {
            $this->user->password = Hash::make($request->get('new_password'));
            $this->user->save();
        }
    }
}
