

//page control -> leftmenue part
webcontrol = 0;
var bt1 = document.querySelector(".btnews");
var bt2 = document.querySelector(".btsearch");
bt1.addEventListener("click",function(){
    bt1.className= "btnews select"
    bt2.className = "btsearch"
    document.querySelector(".newsdisplay").style.display="block"
    document.querySelector(".searchdisplay").style.display="none"
})
bt2.addEventListener("click",function(){
    bt1.className= "btnews "
    bt2.className = "btsearch select"
    document.querySelector(".newsdisplay").style.display="none"
    document.querySelector(".searchdisplay").style.display="block"
})
// get the document
var card=new Array();
var foxn=new Array();
var cnnn=new Array();
cnt=1;
document.addEventListener("DOMcontentLoaded", webinit())
document.querySelector("form").addEventListener("submit",submitform)

function webinit(){
    gethead()
    getnews()
    drawWC()
    getsource()
    settime()
    
    
}

function gethead(){
    //url = "http://127.0.0.1:5000/headline";
    url ="http://csci585-python.us-east-1.elasticbeanstalk.com/headline"
    xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send();
    // json     Doc = JSON.parse(xml.responseText);
    Doc=JSON.parse(xml.responseText);
    Doc = Doc.articles
     
    for( i =0;i<5;i++){
        var text= " <a href=" + Doc[i].url + " style=\"text-decoration: none;\">"
        text+="<div  class=\"cardtop\">"
        text+="    <img src="+ Doc[i].imageurl+" >"
        text+=  " <div class = \"cardbd\">"
        text+= "<div class=\"cardtitle\">" +Doc[i].title + "</div>"
        text+= "<div class=\"carddesc\">  " + Doc[i].description+"</div>"
        text+=  " </div> </div> </a> "
        card[i] = text
        
    }
    document.getElementById("card").innerHTML = card[0];
    setInterval(() => {
        cnt +=1;
        document.getElementById("card").innerHTML = card[cnt-1];
        if(cnt ==5) cnt =1;
    }, 3000);

 
}

function getnews(){
    //url = "http://127.0.0.1:5000/sourcenews";
    url ="http://csci585-python.us-east-1.elasticbeanstalk.com/sourcenews"
    xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send();
    Doc=JSON.parse(xml.responseText);
    // cnn 
    cnnnew = Doc.CNN;
    tb = document.getElementsByClassName("cnnt")
    for( i =0;i<4;i++){
        var text = "<img src="+ cnnnew[i].imageurl+ " ></img>";
        text +=  "<h4>"+cnnnew[i].title +"</h4>";
        text +="<p>" +cnnnew[i].description + "</p>"
        tb[i].innerHTML=text;
        cnnn[i]= cnnnew[i].url
        tb[i].addEventListener("click",function(){
            const nodes = Array.prototype.slice.call( this.parentNode.childNodes );
            const index = nodes.indexOf(this);
            location.href =cnnn[(index-1)/2 ]; 
        })
    }
    foxnew = Doc.FOX;
    tb = document.getElementsByClassName("foxt")
    for( i =0;i<4;i++){
        var text = "<img src="+ foxnew[i].imageurl+ " ></img>";
        text +=  "<h4>"+foxnew[i].title +"</h4>";
        text +="<p>" +foxnew[i].description + "</p>"
        tb[i].innerHTML=text;
        foxn[i]= foxnew[i].url
        tb[i].addEventListener("click",function(){
            const nodes = Array.prototype.slice.call( this.parentNode.childNodes );
            const index = nodes.indexOf(this);
            location.href =foxn[(index-1)/2 ]; 
        })
    }
}

function drawWC(){
    //url = "http://127.0.0.1:5000/wordcloud";
    url ="http://csci585-python.us-east-1.elasticbeanstalk.com/wordcloud"
    xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send();
    // json     Doc = JSON.parse(xml.responseText);
    Doc=JSON.parse(xml.responseText);
    words = Doc.words
    //
    var margin = {top: 3, right: 3, bottom: 3, left: 3},
    width = 240 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    //svg 
    var svg = d3.select("#wordcloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    //layout
    var layout = d3.layout.cloud()
  .size([width, height])
  .words(words.map(function(d) { return {text: d.word, size:d.Nor}; }))
  .padding(2)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
layout.start();



function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size +"px"; })
          .style("fill", "#000000")
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  }
}


function submitform(e){
    // dont redirect
    e.preventDefault();
    //handle data 
    var kw = document.getElementsByName("Keyword")[0].value;
    var f1 = document.getElementsByName("from1")[0].value
    var t1 = document.getElementsByName("to1")[0].value
    var sou = document.getElementsByName("sour")[0].value;
    //handle error
    if(t1<f1){
        alert("incorrect time");
        return;
    }
    //query 
    var q = "?keyword="+kw +"&from=" +f1 + "&to=" + t1  + "&sour=" + sou;
    //url = "http://127.0.0.1:5000/search" + q;
    url ="http://csci585-python.us-east-1.elasticbeanstalk.com/search" + q;
    console.log(url);
    //submit
    xml.open("GET",url,false);
    xml.send();
    try{
        Doc=JSON.parse(xml.responseText);
    }catch(e){
        alert(e);
    }
    //show result
    results = document.querySelector(".results")
    results.style.display="block";
    docfile = Doc.news.articles;
    // built result
    var text="";
    for(i=1;i<=5;i++){
        text+="<div class= \"result\">"
        text += "<img src="+docfile[i].urlToImage+">"
        text +="<div>"
        text +="<p class=\"ti\">"+docfile[i].title+"</p>"
        text += "<p class=\"de\">" +docfile[i].description+ "</p>"
        text +="</div></div>"
    }
    results.innerHTML=text;

    
    
}

function resetform(){
    //keyword
    document.getElementsByName("Keyword")[0].value="";
    //time
    settime();
    //option
    optCate = document.getElementsByName("cate")[0];
    optCate.options[0].selected = true;
    optSour = document.getElementsByName("sour")[0];
    optSour.options[0].selected =true;
    var tmp = document.getElementsByName("sour")[0];
    tmp.innerHTML="";
    tmp.options.add(new Option('ALL','all'));


}
function getsource(){
    var q = document.getElementsByName("cate")[0].value;
    //url = "http://127.0.0.1:5000/getsource" + "?cat="+q;
    url ="http://csci585-python.us-east-1.elasticbeanstalk.com/getsource" + "?cat="+q;
    xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send();
    // json     Doc = JSON.parse(xml.responseText);
    Doc=JSON.parse(xml.responseText);
    sources = Doc.sources;
    //console.log(sources)
    var tmp = document.getElementsByName("sour")[0];
    if(tmp.options.length>2){
        tmp.innerHTML=""
    }

    tmp.options.add(new Option('ALL','all'));
    for(i=0;i<10;i++){
        tmp.options.add(new Option(sources[i].name,sources[i].id));
    }
}
function settime(){
    //date 
    var str = getdate();
    fromform  = document.getElementsByName("from1")[0];
    toform = document.getElementsByName("to1")[0];
    
    today= str[0] + "-"+ str[1] + "-"+str[2];
    lastweek = str[3] + "-"+ str[4] + "-"+str[5];
    fromform.value = lastweek;
    toform.value = today;
}
function getdate(){
    var ddd = new Date();
    var day = ddd.getDate();
    var str=new Array();
    if(ddd.getMonth()<10){
        var month = "0"+(ddd.getMonth()+1)
    }
    if(ddd.getDate()<10){
        day = "0"+ddd.getDate(); 
    }
    str[0] = ddd.getFullYear();
    str[1] = month;
    str[2] = day;
// 7days ago
    var date = new Date(); //当前日期
    var newDate = new Date();
    newDate.setDate(date.getDate() -7);

    if(newDate.getMonth()<10){
        var month = "0"+(newDate.getMonth()+1)
    }
    if(newDate.getDate()<10){
        day = "0"+newDate.getDate(); 
    }
    str[3] = newDate.getFullYear();
    str[4] = month;
    str[5] = day;

    return str;
}


