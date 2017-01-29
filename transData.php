<?php
    header('Access-Control-Allow-Origin:*');
    $api_key="&apikey=75d7da940bbc4b3aadc677ff557db8a9";

    $fakeHead= "http://congress.api.sunlightfoundation.com/";
    $sunlightHead = "http://104.198.0.197:8080/";
    
    
    if(isset($_GET["query"])){
        $url = $sunlightHead.$_GET["query"].$api_key;
        
        $result = file_get_contents($url);
        if($result==false){
            $newURL = $fakeHead.$_GET["query"].$api_key;
            $TryResult = file_get_contents($newURL);
            if($TryResult==false){
                echo $newURL;
            }
            else echo $TryResult;
        }
        else{
            echo $result;
        }
    }

