<?php

namespace G3n1us\LaravelReactSync\Views\Components;

use Illuminate\View\Component;

class RenderableClass extends Component
{
	public $pageClass;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($pageClass = null)
    {
        $this->pageClass = $pageClass;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('react_sync::components.renderable');
    }
}
