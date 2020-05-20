<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
@include('react_sync::page_js')

    <script src="{{ asset('js/app.js') }}?v={{env('APP_VERSION', 9999999)}}" defer></script>

    <link href="{{ asset('css/app.css') }}?v={{env('APP_VERSION', 9999999)}}" rel="stylesheet">

</head>

<body class="{{$bg_class ?? ''}} {{$page_name_class}}">
@if ($errors->any())
    <div class="alert alert-danger">
        <a class="close" href="#" data-dismiss="alert">&times;</a>

        <ul>
            @foreach ($errors->all() as $error)
                <li>{!! $error !!}</li>
            @endforeach
        </ul>
    </div>
@endif

@section('content')

	        <x-react-sync-render :page-class="$page_class" />
{!! ssr(__DIR__.'/../../../public/js/server-app.js')->render() !!}

<!--             <div id="content" data-react-render="{{$page_class ?? null}}"></div> -->
@show
            <div id="app"></div>

    <div id="notification_outer">
        @if (session('status'))
            <div class="alert alert-success text-black" role="alert">
                {{ session('status') }}
                <a href="#" class="close" data-dismiss="alert">&times;</a>
            </div>
        @endif
        @if (session('message'))
            <div class="alert alert-success text-black" role="alert">
                {{ session('message') }}
                <a href="#" class="close" data-dismiss="alert">&times;</a>
            </div>
        @endif
        @php
        $session_errors = session('error') ?? [];
        if($session_errors && !is_array($session_errors)){
            $session_errors = [$session_errors];
        }
        $session_errors = array_unique($session_errors);
        @endphp
        @foreach($session_errors as $session_error)
            <div class="alert alert-danger text-black" role="alert">
                {{ $session_error }}
                <a href="#" class="close" data-dismiss="alert">&times;</a>
            </div>
        @endforeach
    </div>
    <script>
        setTimeout(function(){
            if(!document.querySelector('#notification_outer .alert-danger')){
                document.getElementById('notification_outer').innerHTML = '';
            }

        }, 4000);
    </script>

    <script type="text/json" id="validation_errors">{!! $errors->toJSON() !!}</script>
    <script type="text/json" id="old_input">{!! collect(old())->filter(function($v, $i){ return $i[0] != '_';  }) !!}</script>

<script>
    (function(){
        var old = JSON.parse(document.getElementById('old_input').innerHTML);
        var errors = JSON.parse(document.getElementById('validation_errors').innerHTML);
        for(var o in old){
            var old_input = document.querySelector('[name="'+o+'"]');
            if(old_input) old_input.value = old[o];
        }
        for(var error in errors){
            var input = document.querySelector('[name="'+error+'"]');

            input && input.classList.add('is-invalid');
            var warning_message = document.createElement('span')
            warning_message.classList.add('invalid-feedback');
            warning_message.classList.add('d-block');
            warning_message.innerHTML = '<strong>'+ errors[error].join('<br>') +'</strong>';
            input.parentElement.insertBefore(warning_message, input);
        }

        document.addEventListener('submit', function(e){
            if(e.currentTarget.activeElement.value == 'download'){
                return;
            }

            $(e.target).find('[type="submit"]').each(function(){
                $(this).addClass('disabled')
                    .attr('readonly', true)
                    .css('cursor', 'not-allowed');
                $(this).find('i[class*="fa"]').each(function(){
                    $(this).attr('class', 'fa fa-cog fa-spin');
                });
            });
            e.target.addEventListener('submit', function(e){
                e.preventDefault();
                return false;
            });
        });
    })()

</script>
</body>
</html>
