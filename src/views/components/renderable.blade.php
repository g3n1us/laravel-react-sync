
<div id="content" data-react-render="{{$pageClass ?? null}}"></div>
{!! ssr('js/server-app.js')->debug(true)->context('page_class', $pageClass)->fallback('<div id="WWWWWW"></div>')->render() !!}