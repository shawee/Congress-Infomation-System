//global variables
state_hash =  {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District Of Columbia',
    'FM': 'Federated States Of Micronesia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MH': 'Marshall Islands',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'MP': 'Northern Mariana Islands',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PW': 'Palau',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VI': 'Virgin Islands',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
  };

monthName = [
  "Jan", "Feb", "March",
  "April", "May", "Jun", "July",
  "Aug", "Sept", "Oct",
  "Nov", "Dec"
];
$(document).ready(function(){
        //navigation
        var nav_button = $('#navi_button');
        naviShow = true;
        nav_button.click(function(e){
            var content = $(".content_wrapper");
            e.preventDefault();
            content.toggleClass("toggled");
            if(naviShow==true){
                naviShow=false;
                $("#content_tab_table").attr("class", "col-xs-12 col-sm-12 col-md-12 col-lg-12");
                $("#nav_wrapper").hide();
                
            }else{
                naviShow=true;
                $("#content_tab_table").attr("class", "col-xs-10 col-sm-10 col-md-10 col-lg-10");
                $("#nav_wrapper").show()
            }
        });
//        localStorage.clear();
    });
    
//progress bar
//ui.bootstrap
        
//pagination
var xue_app=angular.module('xue_app', ['angularUtils.directives.dirPagination','ui.bootstrap']);

xue_app.run(function($rootScope, $http){
    $rootScope.favor_legis=[];
    $rootScope.favor_commi=[];
    $rootScope.favor_bills=[];
    
    //legis_details
    $rootScope.viewLegiDetails=function(legis_line){
        $('#sidebar a[href="#legis_tab"]').tab('show');
        var info = legis_line;
        //view details in infocontroller
        $rootScope.markLegiStar=function(){
            //change the color of star
            var bio_id=info.bioguide_id;
            if(!localStorage.getItem(bio_id)){
                $(".legis_star:first").attr({class: "fa fa-star legis_star"});
                if(typeof(Storage)!=="undefined"){
                    if(localStorage.getItem("legis")){
                        var legis_list=JSON.parse(localStorage.getItem("legis"));
                        legis_list.push(info.bioguide_id);
                        localStorage.setItem("legis", JSON.stringify(legis_list));
                        localStorage.setItem(info.bioguide_id, JSON.stringify(info));
                    }else{
                        localStorage.setItem("legis", "[]");
                        var legis_list=[];
                        legis_list.push(info.bioguide_id);
                        localStorage.setItem("legis", JSON.stringify(legis_list));
                        localStorage.setItem(info.bioguide_id, JSON.stringify(info));
                    }
                    

                }else{
                    console.log("the stroage is not supported");
                }
            }
            else{
                $(".legis_star:first").attr({class: "fa fa-star-o legis_star"});
                if(typeof(Storage)!=="undefined"){
                    var legis_list=JSON.parse(localStorage.getItem("legis"));
                    var index = legis_list.indexOf(info.bioguide_id);
                    legis_list.splice(index,1);
                    localStorage.setItem("legis", JSON.stringify(legis_list));
                    localStorage.removeItem(info.bioguide_id);
                }
            }
            
            if(localStorage.getItem("legis")!=null){
                legis_list = JSON.parse(localStorage.getItem("legis"));
                $rootScope.favor_legis=[];
                for(var i = 0; i<legis_list.length; i=i+1){
                    var legis = JSON.parse(localStorage.getItem(legis_list[i]));
                    $rootScope.favor_legis.push(legis);
                    }
                }   
        };
        
        if(localStorage.getItem(info.bioguide_id)){
            $(".legis_star:first").attr({class: "fa fa-star legis_star"});
        }else{
            $(".legis_star:first").attr({class: "fa fa-star-o legis_star"});
        }
        
        var bio_id=info.bioguide_id;
        var bill_url = "bills?sponsor_id=" + bio_id + "&per_page=5";
        var commi_url = "committees?member_ids="+bio_id+"&per_page=5";
        bill=[];
        commi=[];

        $http({
            method: 'GET',
            url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
            params:{'query': bill_url}
            
        }).then(function successCallback(response){
            bill = response.data.results;
            
            $http({
                method: 'GET',
                url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
                params: {'query': commi_url}
            }).then(function successCallback(response){
                commi=response.data.results;
                var img_url ="http://theunitedstates.io/images/congress/original/"+bio_id+".jpg";
                var bio_title=info.title+". ";
                var first_name = info.first_name+" ";
                var last_name = info.last_name;
                var email=info.oc_email;
                if(email==null) email="N/A";
                
                var party_name="";
                if(info.party!='D'){
                    party_name="Republican";
                }else{party_name="Democrat";}
                
                var startTermDate=new Date(info.term_start);
                var endTermDate=new Date(info.term_end);
                var currentTime = new Date();
                var termProgress = Math.floor((currentTime-startTermDate)/(endTermDate-startTermDate)*100);
                var birthday = new Date(info.birthday);
                var fax=info.fax;
                if(fax==null) fax="N/A";
                var panelHtml="";
                //add the click function
                
                //construct panel html
                panelHtml+="<div class='col-xs-12 col-sm-6 col-dm-6 col-lg-6'>";
                
                panelHtml+="<table class='table detail_center'><tr style='text-align:center;'><td colspan='2'><div class='row-fluid'><div class='col-xs-12 col-sm-6 col-dm-6 col-lg-6'>";
                panelHtml+="<img src="+img_url+" class='legis_photo'></div>";
                
                panelHtml+="<div class='detail-center col-xs-12 col-sm-6 col-dm-6 col-lg-6'><table class='table col-dm-3'><tr><td><p>"+bio_title+last_name+", "+first_name+"</p></td></tr>";
                panelHtml+="<tr><td><a href=mailto:'"+email+"'>"+email+"</a></td></tr>";
                panelHtml+="<tr><td><p>Chamber:"+info.chamber+"</p></td></tr>";
                panelHtml+="<tr><td>Contact: "+info.phone+"</td></tr>";
                panelHtml+="<tr><td><img src=img/"+info.party.toLowerCase()+".png class='partyIcon'><span>"+party_name+"</span></td></tr>";
                panelHtml+="</table></div></div></td></tr>";
                
                
                panelHtml+="<tr><td>Start Term</td><td>"+monthName[startTermDate.getMonth()]+startTermDate.getDate().toString()+","+startTermDate.getFullYear().toString()+"</td></tr>";
                panelHtml+="<tr><td>End Term</td><td>"+monthName[endTermDate.getMonth()]+endTermDate.getDate().toString()+","+endTermDate.getFullYear().toString()+"</td></tr>";
                //progress bar
                //panelHtml+="<tr><td>Term</td><td><div><uib-progressbar value="+termProgress.toString()+" type='success'>"+termProgress.toString()+"</uib-progressbar></div></td></tr>";
                //
                panelHtml+="<tr><td>Term</td><td><div class='progress ng-isolate-scope' value='"+termProgress.toString()+"' type='success'><div class='progress-bar progress-bar-success' ng-class='type && 'progress-bar-' + type' role='progressbar' aria-valuenow='"+termProgress.toString()+"' aria-valuemin='0' aria-valuemax='100' ng-style='{width: (percent < 100 ? percent : 100) + '%'}' aria-valuetext='"+termProgress.toString()+"%' aria-labelledby='progressbar' ng-transclude='' style='width: "+termProgress.toString()+"%;'><span class='ng-scope'>"+termProgress.toString()+"%"+"</span></div></div></td></tr>";
                
                
                panelHtml+="<tr><td>Office</td><td>"+info.office+"</td></tr>";
                panelHtml+="<tr><td>State</td><td>"+info.state_name+"</td></tr>";
                panelHtml+="<tr><td>Fax</td><td>"+fax+"</td></tr>";
                panelHtml+="<tr><td>Birthday</td><td>"+monthName[birthday.getMonth()]+birthday.getDate().toString()+","+birthday.getFullYear().toString()+"</td></tr>";
                panelHtml+="<tr><td>Social Link:</td><td>"+"<a style='display:inline' href='http://twitter.com/"+info.twitter_id+"'><img class='social_img' src='img/t.png'></a><a style='display:inline' href='http://www.facebook.com/"+info.facebook_id+"'><img class='social_img' src='img/f.png'></a><a style='display:inline' href='"+info.website+"'><img  class='social_img' src='img/w.png'></a></td></tr>";
                panelHtml+="</table></div>";
                
                panelHtml+="<div class='col-xs-12 col-sm-6 col-dm-6 col-lg-6'><table class='table'>";
                panelHtml+="<tr><td>Committees</td></tr>";
                panelHtml+="<tr><td>";
                
                //committees
                panelHtml+="<table class='table'><tr><th>Chamber</th><th>Committees ID</th><th class='hidden-xs'>Name</th></tr>";
                for(var i = 0; i<commi.length; i=i+1){
                    panelHtml+="<tr><td>"+commi[i].chamber+"</td>";
                    panelHtml+="<td>"+commi[i].committee_id+"</td>";
                    panelHtml+="<td class='hidden-xs'>"+commi[i].name+"</td>";
                    panelHtml+="</tr>";
                }
                panelHtml+="</table>";
                panelHtml+="</td></tr>";
                
                //bills
                panelHtml+="<tr><td>Bills</td></tr>";
                panelHtml+="<tr><td>";
                panelHtml+="<table class='table'><tr><th>Bill ID</th><th class='hidden-xs'>Title</th><th class='hidden-xs'>Chamber</th><th class='hidden-xs'>Bill Type</th><th class='hidden-xs'>Congress</th><th>Link</th></tr>";
                
                for(var i = 0; i<bill.length; i=i+1){
                    panelHtml+="<tr><td>"+bill[i].bill_id+"</td>";
                    panelHtml+="<td class='hidden-xs'>"+bill[i].official_title+"</td>";
                    panelHtml+="<td class='hidden-xs'>"+bill[i].chamber+"</td>";
                    panelHtml+="<td class='hidden-xs'>"+bill[i].bill_type+"</td>";
                    panelHtml+="<td class='hidden-xs'>"+bill[i].congress+"</td>";
                    if(bill[i].last_version!=null) panelHtml+="<td><a href='"+bill[i].last_version.urls.pdf+"'>Link</a></td></tr>";
                    else panelHtml+="<td>N/A</td></tr>"
                }
                panelHtml+="</table></div></div>";
                
                $("#detailsPane").html(panelHtml);
                
                $("#carousel").carousel(1);
            },function errorCallback(response){

            });

        },function errorCallback(response){
            
        });
        //end of view details
    };
    
    //bill details
     $rootScope.viewBillDetails=function(info){
        $('#sidebar a[href="#bill_tab"]').tab('show');
         $rootScope.markfavorBill=function(){
            var bill_id=info.bill_id;
            if(!localStorage.getItem(bill_id)){
                $(".bill_star:first").attr({class: "fa fa-star bill_star"});
                if(typeof(Storage)!=="undefined"){
                    if(localStorage.getItem("bills")){
                        var bill_list=JSON.parse(localStorage.getItem("bills"));
                        bill_list.push(info.bill_id);
                        localStorage.setItem("bills", JSON.stringify(bill_list));
                        localStorage.setItem(info.bill_id, JSON.stringify(info));
                    }else{
                        var bill_list=[];
                        localStorage.setItem("bills","[]");
                        bill_list.push(info.bill_id);
                        localStorage.setItem("bills", JSON.stringify(bill_list));
                        localStorage.setItem(info.bill_id, JSON.stringify(info));
                    }

                }else{
                    console.log("the stroage is not supported");
                }
            }
            else{
                $(".bill_star:first").attr({class: "fa fa-star-o bill_star"});
                if(typeof(Storage)!=="undefined"){
                    var bill_list=JSON.parse(localStorage.getItem("bills"));
                    var index = bill_list.indexOf(info.bill_id);
                    bill_list.splice(index,1);
                    localStorage.setItem("bills", JSON.stringify(bill_list));
                    localStorage.removeItem(info.bill_id);
                }
            }
            
             
            if(localStorage.getItem("bills")!=null){
                bills_list = JSON.parse(localStorage.getItem("bills"));
                $rootScope.favor_bills=[];
                for(var i = 0; i<bill_list.length; i=i+1){
                    var bill = JSON.parse(localStorage.getItem(bill_list[i]));
                    $rootScope.favor_bills.push(bill);
                    }
                }
         };
         
        if(localStorage.getItem(info.bill_id)){
                $(".bill_star:first").attr({class: "fa fa-star bill_star"});
            }else{
                $(".bill_star:first").attr({class: "fa fa-star-o bill_star"});
            }
         
         var panelHtml = "";
         var is_active = info.history.active==true? "Active":"New";
         var intro=new Date(info.introduced_on);
         var intro_date=monthName[intro.getMonth()]+" "+intro.getDate().toString()+","+intro.getFullYear().toString();
         
         panelHtml+="<div class='col-xs-12 col-sm-6 col-md-6 col-lg-6'>";
         panelHtml+="<table class='table'><tr><th>Bill ID</th><td>"+info.bill_id+"</td></tr>";
         panelHtml+="<tr class='hidden-xs'><th>Title</th><td>"+info.official_title+"</td></tr>";
         panelHtml+="<tr><th>Bill Type</th><td>"+info.bill_type+"</td></tr>";
         panelHtml+="<tr><th>Sponsor</th><td>"+info.sponsor.title+". "+info.sponsor.last_name+", "+info.sponsor.first_name+"</td></tr>";
         panelHtml+="<tr><th>Chamber</th><td>"+info.chamber+"</td></tr>";
         panelHtml+="<tr><th>Status</th><td>"+is_active+"</td></tr>";
         panelHtml+="<tr><th>Introduced On</th><td>"+intro_date+"</td></tr>";
         panelHtml+="<tr><th>Congress URL</th><td><a href='"+info.urls.congress+"'>URL</a></td></tr>";
         if(info.last_version){
             panelHtml+="<tr><th>Version Status</th><td>"+info.last_version.version_name+"</td></tr>";
             panelHtml+="<tr><th>Bill URL</th><td><a href='"+info.last_version.urls.pdf+"'>URL</a></td></tr>";
         }
         else{
             panelHtml+="<tr><th>Version Status</th><td>"+"N.A"+"</td></tr>";
             panelHtml+="<tr><th>Bill URL</th><td><a>N.A</a></td></tr>";
         }
         panelHtml+="</table>";
         panelHtml+="</div>";
         if(info.last_version){
             panelHtml+="<div class='col-xs-12 col-sm-6 col-md-6 col-lg-6'><object data='"+info.last_version.urls.pdf+"' class='pdfObj'></object></div>";
        }
        $("#billDetailsPane").html(panelHtml);
        $("#BillCarousel").carousel(1);
    };
     
     $rootScope.markFavorCom = function(info){
         var committee_id=info.committee_id;
         var ele="#"+committee_id;
            if(!localStorage.getItem(committee_id)){
                $(ele).attr({class: "fa fa-star commi_star"});
                if(typeof(Storage)!=="undefined"){
                    if(localStorage.getItem("committees")){
                        var commi_list=JSON.parse(localStorage.getItem("committees"));
                        commi_list.push(info.committee_id);
                        localStorage.setItem("committees", JSON.stringify(commi_list));
                        localStorage.setItem(info.committee_id, JSON.stringify(info));
                    }else{
                        var commi_list = [];
                        localStorage.setItem("committees","[]");
                        commi_list.push(info.committee_id);
                        localStorage.setItem("committees", JSON.stringify(commi_list));
                        localStorage.setItem(info.committee_id, JSON.stringify(info));
                    }

                }else{
                    console.log("the stroage is not supported");
                }
            }
            else{
                $(ele).attr({class: "fa fa-star-o commi_star"});
                if(typeof(Storage)!=="undefined"){
                    var commi_list=JSON.parse(localStorage.getItem("committees"));
                    var index = commi_list.indexOf(info.committee_id);
                    commi_list.splice(index,1);
                    localStorage.setItem("committees", JSON.stringify(commi_list));
                    localStorage.removeItem(info.committee_id);
                }
            }
            
             
            if(localStorage.getItem("committees")!=null){
                bills_list = JSON.parse(localStorage.getItem("committees"));
                $rootScope.favor_commi=[];
                for(var i = 0; i<commi_list.length; i=i+1){
                    var bill = JSON.parse(localStorage.getItem(commi_list[i]));
                    $rootScope.favor_commi.push(bill);
                    }
                }
     };
})

function infor_control($rootScope, $scope, $http) {
    $scope.currentPage=1;
    $scope.pageSize = 10;
    $scope.congressLines=[];
    $scope.selectedTab = $("ul#tablist li.active")[0].innerText;
    var inforObj;
    
    $http({
        method: 'GET',
        url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
        params: {'query' : "legislators?per_page=all"} 
        
    }).then(function successCallback(response){
        $scope.congressLines=response.data.results;
        
    },function errorCallback(response){
        
    });

    $scope.pageChangeHandler = function(num){
        console.log("pages changes to "+num);
    };
    
    //detail controll
    $scope.viewDetails=function(key, info){
        $rootScope.viewLegiDetails(info);
        //
//        $scope.markLegiStar=function(){
//            //change the color of star
//            var bio_id=info.bioguide_id;
//            if(!localStorage.getItem(bio_id)){
//                $(".legis_star:first").attr({class: "fa fa-star legis_star"});
//                if(typeof(Storage)!=="undefined"){
//                    var legis_list=JSON.parse(localStorage.getItem("legis"));
//                    legis_list.push(info.bioguide_id);
//                    localStorage.setItem("legis", JSON.stringify(legis_list));
//                    localStorage.setItem(info.bioguide_id, JSON.stringify($scope.markID));
//
//                }else{
//                    console.log("the stroage is not supported");
//                }
//            }
//            else{
//                $(".legis_star:first").attr({class: "fa fa-star-o legis_star"});
//                if(typeof(Storage)!=="undefined"){
//                    var legis_list=JSON.parse(localStorage.getItem("legis"));
//                    var index = legis_list.indexOf(info.bioguide_id);
//                    legis_list.splice(index,1);
//                    localStorage.setItem("legis", JSON.stringify(legis_list));
//                    localStorage.removeItem(info.bioguide_id);
//                }else{
//                    console.log("the stroage is not supported");
//                }
//            }
//            
//
//            if(localStorage.getItem("legis")!=null){
//                legis_list = JSON.parse(localStorage.getItem("legis"));
//                $rootScope.favor_legis=[];
//                for(var i = 0; i<legis_list.length; i=i+1){
//                    var legis = JSON.parse(localStorage.getItem(legis_list[i]));
//                    $rootScope.favor_legis.push(legis);
//                    }
//                }   
//        };
//        
//        if(localStorage.getItem(info.bioguide_id)){
//            $(".legis_star:first").attr({class: "fa fa-star legis_star"});
//        }else{
//            $(".legis_star:first").attr({class: "fa fa-star-o legis_star"});
//        }
//        
//        var bio_id=info.bioguide_id;
//        var bill_url = "bills?sponsor_id=" + bio_id + "&per_page=5";
//        var commi_url = "committees?member_ids="+bio_id+"&per_page=5";
//        $scope.bill=[];
//        $scope.commi=[];
//
//        $http({
//            method: 'GET',
//            url: "transData.php",
//            params:{'query': bill_url}
//            
//        }).then(function successCallback(response){
//            $scope.bill = response.data.results;
//            
//            $http({
//                method: 'GET',
//                url: "transData.php",
//                params: {'query': commi_url}
//            }).then(function successCallback(response){
//                $scope.commi=response.data.results;
//                var img_url ="https://theunitedstates.io/images/congress/original/"+bio_id+".jpg";
//                var bio_title=info.title+". ";
//                var first_name = info.first_name+" ";
//                var last_name = info.last_name;
//                var email=info.oc_email;
//                if(email==null) email="N/A";
//                
//                var party_name="";
//                if(info.party!='D'){
//                    party_name="Republican";
//                }else{party_name="Democrat";}
//                
//                var startTermDate=new Date(info.term_start);
//                var endTermDate=new Date(info.term_end);
//                var currentTime = new Date();
//                var termProgress = Math.floor((endTermDate-currentTime)/(endTermDate-startTermDate)*100);
//                var birthday = new Date(info.birthday);
//                var fax=info.fax;
//                if(fax==null) fax="N/A";
//                var panelHtml="";
//                //add the click function
//                $scope.markID=info;
//                
//                //construct panel html
//                panelHtml+="<div class='row'><table><tr><td><table class='table col-dm-6'><tr><td>";
//                panelHtml+="<img src="+img_url+" class='col-dm-3 legis_photo'>";
//                panelHtml+="</td><td><table class='table col-dm-3'><tr><td><p>"+bio_title+last_name+", "+first_name+"</p></td></tr>";
//                panelHtml+="<tr><td><a href='"+email+"'>"+email+"</a></td></tr>";
//                panelHtml+="<tr><td><p>Chamber:"+info.chamber+"</p></td></tr>";
//                panelHtml+="<tr><td>Contact: "+info.phone+"</td></tr>";
//                panelHtml+="<tr><td><img src=img/"+info.party+".png class='partyIcon'><span>"+party_name+"</span></td></tr>";
//                panelHtml+="</table></td></tr>";
//                
//                panelHtml+="<tr><td>Start Term</td><td>"+monthName[startTermDate.getMonth()]+startTermDate.getDate().toString()+","+startTermDate.getFullYear().toString()+"</td></tr>";
//                panelHtml+="<tr><td>End Term</td><td>"+monthName[endTermDate.getMonth()]+endTermDate.getDate().toString()+","+endTermDate.getFullYear().toString()+"</td></tr>";
//                //progress bar
//                //panelHtml+="<tr><td>Term</td><td><div><uib-progressbar value="+termProgress.toString()+" type='success'>"+termProgress.toString()+"</uib-progressbar></div></td></tr>";
//                //
//                panelHtml+="<tr><td>Term</td><td><div class='progress ng-isolate-scope' value='"+termProgress.toString()+"' type='success'><div class='progress-bar progress-bar-success' ng-class='type && 'progress-bar-' + type' role='progressbar' aria-valuenow='"+termProgress.toString()+"' aria-valuemin='0' aria-valuemax='100' ng-style='{width: (percent < 100 ? percent : 100) + '%'}' aria-valuetext='"+termProgress.toString()+"%' aria-labelledby='progressbar' ng-transclude='' style='width: "+termProgress.toString()+"%;'><span class='ng-scope'>"+termProgress.toString()+"%"+"</span></div></div></td></tr>";
//                
//                
//                panelHtml+="<tr><td>Office</td><td>"+info.office+"</td></tr>";
//                panelHtml+="<tr><td>State</td><td>"+info.state_name+"</td></tr>";
//                panelHtml+="<tr><td>Fax</td><td>"+fax+"</td></tr>";
//                panelHtml+="<tr><td>Birthday</td><td>"+monthName[birthday.getMonth()]+birthday.getDate().toString()+","+birthday.getFullYear().toString()+"</td></tr>";
//                panelHtml+="<tr><td>Social Link:</td><td>asdasd</td></tr>";
//                panelHtml+="</table></td>";
//                panelHtml+="<td><table class='table col-dm-6'>";
//                panelHtml+="<tr><td>Committees</td></tr>";
//                panelHtml+="<tr><td>";
//                
//                //committees
//                panelHtml+="<table class='table'><tr><th>Chamber</th><th>Committees ID</th><th>Name</th></tr>";
//                for(var i = 0; i<$scope.commi.length; i=i+1){
//                    panelHtml+="<tr><td>"+$scope.commi[i].chamber+"</td>";
//                    panelHtml+="<td>"+$scope.commi[i].committee_id+"</td>";
//                    panelHtml+="<td>"+$scope.commi[i].name+"</td>";
//                    panelHtml+="</tr>";
//                }
//                panelHtml+="</table>";
//                panelHtml+="</td></tr>";
//                panelHtml+="<tr><td>Bills</td></tr>";
//                
//                
//                //bills
//                panelHtml+="<tr><td>";
//                panelHtml+="<table class='table'><tr><th>Bill ID</th><th>Title</th><th>Chamber</th><th>Bill Type</th><th>Congress</th><th>Link</th></tr>";
//                
//                for(var i = 0; i<$scope.bill.length; i=i+1){
//                    panelHtml+="<tr><td>"+$scope.bill[i].bill_id+"</td>";
//                    panelHtml+="<td>"+$scope.bill[i].official_title+"</td>";
//                    panelHtml+="<td>"+$scope.bill[i].chamber+"</td>";
//                    panelHtml+="<td>"+$scope.bill[i].bill_type+"</td>";
//                    panelHtml+="<td>"+$scope.bill[i].congress+"</td>";
//                    if($scope.bill[i].last_version!=null) panelHtml+="<td><a href='"+$scope.bill[i].last_version.urls.pdf+"'>Link</a></td></tr>";
//                    else panelHtml+="<td>N/A</td></tr>"
//                }
//                panelHtml+="</table></td></tr>";
//                panelHtml+="</table></td></tr></table>";
//                
//                                
//                $("#detailsPane").html(panelHtml);
//                
//                $("#carousel").carousel(1);
//            },function errorCallback(response){
//
//            });
//
//        },function errorCallback(response){
//            
//        });
    }
}
function pageNumController($scope){
    $scope.pageChangeHandler = function(num){
        //console.log('going to page '+num);
    };
}


function backcontroller($scope){
    $scope.backCarousel=function(){
        console.log("invoke backcontroller");
        $("#carousel").carousel(0);
    };
}

function billTab_controller($scope, $http){
    $scope.activebills=[];
    $scope.newbills=[];
    $scope.billbackCarousel=function(){
        $("#BillCarousel").carousel(0);
    }
    $http({
        method: 'GET',
        url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
        params: {'query': "bills?history.active=true&per_page=50"}
    }).then(function successCallback(response){
        $scope.activebills=response.data.results;
        $http({
            method: 'GET',
            url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
            params: {'query': "bills?history.active=false&per_page=50"}
        }).then(function successCallback(response){
            $scope.newbills=response.data.results;
            
        }, function errorCallback(response){
            console.log("error in get data from new bills data");
        })
    }, function errorCallback(response){
        console.log("errors in get data from active bills data");
    });
    
    
}

//bills
function billdetailController($scope, $http){
    
   
}

//committees tab
function com_infotable($scope, $http){
    $scope.committeesLines = [];
    $scope.commi_backCarousel=function(){
        $("#commiCarousel").carousel(0);
    }
    $http({
        method: 'GET',
        url: "http://dadsad.senn3xzg9h.us-west-1.elasticbeanstalk.com/transData.php",
        params: {'query': "committees?per_page=all"}
    }).then(function successCallback(response){
        $scope.committeesLines=response.data.results;
    }, function errorCallback(response){
        console.log("error in getting data fron committees");
    });
}

//favorite
function favor_controller($rootScope, $scope, $http){
    if(localStorage.getItem("legis")!=null){
        var legis_list = JSON.parse(localStorage.getItem("legis"));

        for(var i = 0; i<legis_list.length; i=i+1){
            var legis = JSON.parse(localStorage.getItem(legis_list[i]));
            $rootScope.favor_legis.push(legis);
            
        }
    }else{
        localStorage.setItem("legis","[]");
    }
    if(localStorage.getItem("bills")!=null){
        var bills_list = JSON.parse(localStorage.getItem("bills"));

        for(var i = 0; i<bills_list.length; i=i+1){
            var bill = JSON.parse(localStorage.getItem(bills_list[i]));
            $rootScope.favor_bills.push(bill);
            
        }
    }else{
        localStorage.setItem("bills","[]");
    }
    
    if(localStorage.getItem("committees")!=null){
        var bills_list = JSON.parse(localStorage.getItem("committees"));

        for(var i = 0; i<bills_list.length; i=i+1){
            var bill = JSON.parse(localStorage.getItem(bills_list[i]));
            $rootScope.favor_commi.push(bill);
            
        }
    }else{
        localStorage.setItem("committees","[]");
    }
    
    $scope.delete_favor=function(legis_line){
        var info = legis_line;
        var legis_list=JSON.parse(localStorage.getItem("legis"));
        var index = legis_list.indexOf(info.bioguide_id);
        legis_list.splice(index,1);
        localStorage.setItem("legis", JSON.stringify(legis_list));
        localStorage.removeItem(info.bioguide_id);
        var rindex = $rootScope.favor_legis.indexOf(legis_line);
        $rootScope.favor_legis.splice(rindex, 1);
    };
    
    $scope.delete_billfavor=function(bill_line){
        var bill_list = JSON.parse(localStorage.getItem("bills"));
        var index = bill_list.indexOf(bill_line.bill_id);
        bill_list.splice(index,1);
        localStorage.setItem("bills", JSON.stringify(bill_list));
        localStorage.removeItem(bill_line.bill_id);
        var rindex = $rootScope.favor_bills.indexOf(bill_line);
        $rootScope.favor_bills.splice(rindex,1);
    }
    
    $scope.delete_comfavor=function(com_line){
        var bill_list = JSON.parse(localStorage.getItem("committees"));
        var index = bill_list.indexOf(com_line.committee_id);
        bill_list.splice(index,1);
        localStorage.setItem("committees", JSON.stringify(bill_list));
        localStorage.removeItem(com_line.committee_id);
        var rindex = $rootScope.favor_bills.indexOf(com_line);
        $rootScope.favor_commi.splice(rindex,1);
    }
}


xue_app.controller("com_infotable",com_infotable);
xue_app.controller("backcontroller", backcontroller);
xue_app.controller("infor_control", infor_control);
xue_app.controller("pageNumController", pageNumController);
xue_app.controller("billTab_controller", billTab_controller);
xue_app.controller("billdetailController", billdetailController);
xue_app.controller("favor_controller", favor_controller);
//create some directives
xue_app.directive("senateDirective", function(){
    return {
        restrict : "AC",
        template : "<img class=chamberIcon src=img/s.svg>"
    };
});
xue_app.directive("houseDirective", function(){
    return {
        restrict : "AC",
        template : "<img class=chamberIcon src=img/h.png>"
    };
});

//view details
function stateViewDetails(){
    console.log("num");
    console.log("line");
}