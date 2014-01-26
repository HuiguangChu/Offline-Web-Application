var db;
var areaId = null;
var reportId = null;
var paths = null;
var fullname=null;
var filename=[];
var videoname=[];
var myJsonString1=null;
var fi=0;
var position="";
//firstly justify offline or online , if online synchronize the data from local storage with web storage
window.addEventListener("online", function(e) {
		alert("online");
		sync();
		window.open ('geolocation.html', 'newwindow');
		},false);
		
function getxhrObject() {
    var xhrObject = false;
    // Most browsers (including IE7) use the 3 lines below
    if (window.XMLHttpRequest) {
        xhrObject = new XMLHttpRequest();
    }
    // Internet Explorer 5/6 will use one of the following
    else if (window.ActiveXObject) {
        try {
        xhrObject = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(err) {
                try {
                xhrObject = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(err) {
                xhrObject = false;
                }
        }
    }
    return xhrObject;
}

function sync(){
	
	var client= getxhrObject();
	client.open("POST","http://localhost:8080/WebSever/jaxrs/database/info",true);
  client.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  client.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var res = this.responseText;
     alert(res);
     }
  };
  
  db.transaction(
			function(q)
			{
				q.executeSql("select * from report",[],
				function(q, result) 
				{       
					   var jsons = new Array();
						for(var i=0; i< result.rows.length; i++){
							jsons.push(result.rows.item(i));

						}
						
						  var myJsonString = JSON.stringify(jsons);
						  alert(myJsonString);
						
						client.send("name="+myJsonString+"");
				});
			});


}


function showList()
{
	document.getElementById("reportEditor").style.display = "none";
	
}

function showEditor()

{
	//firstly empty the filename array;
	filename=[];
	document.getElementById("reportEditor").style.display = "";
	reportId = this.tagId;
	updateEditor();
	
}

function save()

{   
	fi=0;
	var text = document.getElementById("textEditor").value;
	var title = document.getElementById("reportName").value;
	var areaname= new String( document.getElementById("areas").options[document.getElementById("areas").selectedIndex].value);
	var mydate=new Date();
	
	var year=mydate.getFullYear();
	var month=mydate.getMonth()+1;
	var day=mydate.getDay();
	var date=""+year+"."+month+"."+day+"";
	alert(year);
	alert(month);
	alert(day);
	
	if (!title || title == "" || !text || text == "")
	{
		alert("Input data is not correct.");
		return;
	}
	
	if (!reportId)
	{
		db.transaction(
		function(q)
		{
			q.executeSql("insert into report (area_name, title, report_text, filename,position,date) values(?, ?, ?, ?,?,?)", [areaname, title, text, filename, position,date], null,
			function() { alert("Can not insert new report."); }
			);
		});
	}
	else
	{
		db.transaction(
		function(q)
		{
			q.executeSql("update report set title = ?, report_text = ?, filename = ?, position = ?,date=? where report_id = ?", [title, text, filename, position, reportId,date], null,
			function() { alert("Can not update report."); }
			);
		});
	}
	
	showList();
	updateReports();
	Clearlist();
	alert(position);
}

function cancel()
{
	showList();
	Clearlist();
	filename=[];
}

function updateEditor()
{
	var textEditor = document.getElementById("textEditor");
	var reportName = document.getElementById("reportName");

	if(!reportId)
	{
		textEditor.value = "";
		reportName.value = "";
		
		return;
	}
	
	db.transaction(
	function(q)
	{
		q.executeSql("select * from report where report_id = ?", [reportId], 
		function(q, result) 
		{ 
			if (result.rows != null)
			{
				textEditor.value = result.rows.item(0)["report_text"];
				reportName.value = result.rows.item(0)["title"];
			}
		});
	});
}

function updateReports()
{
	var select = document.getElementById("areas");
	areaname= document.getElementById("areas").options[select.selectedIndex].value;
	var div = document.getElementById("reportList");
	
	for (var i = div.childNodes.length - 1; i >= 0; i--)
	{
		div.removeChild(div.childNodes[i]);
	}

	db.transaction(
	function(q)
	{
		q.executeSql("select * from report where area_name = ?", [areaname], 
		function(q, result) 
		{
			for (var i = 0; i < result.rows.length; i++)
			{
				var id = result.rows.item(i)["report_id"];
			
				var linkEdit = document.createElement("a");
				linkEdit.tagId = id;
				linkEdit.appendChild(document.createTextNode(result.rows.item(i)["title"]));
				linkEdit.href = "javascript:;";
				linkEdit.onclick = showEditor;
				
				div.appendChild(linkEdit);
				div.appendChild(document.createTextNode(" "));
				
				var linkDelete = document.createElement("a");
				linkDelete.tagId = id;
				linkDelete.appendChild(document.createTextNode("Delete"));
				linkDelete.href = "javascript:;";
				linkDelete.onclick = deleteReport;
				
				div.appendChild(linkDelete);
				div.appendChild(document.createElement("br"));
			}
		});
	});
}

function updateAreas()
{
	var select = document.getElementById("areas");
	select.selected = "0";
	
	for (var i = select.childNodes.length - 1; i >= 0; i--)
	{
		select.removeChild(select.childNodes[i]);
	}
	
	db.transaction(
	function(q)
	{
		q.executeSql("select * from area", [], 
		function(q, result) 
		{ 
			for (var i = 0; i < result.rows.length; i++)
			{
				var option = document.createElement("option");
				option.text = result.rows.item(i)["name"];
				option.tagId = result.rows.item(i)["area_id"];
				
				select.add(option, null);
			}
		});
	});
}


function deleteReport()
{
	var id = this.tagId;
	
	db.transaction(
	function(q)
	{
		q.executeSql("delete from report where report_id = ?", [id], function() { updateReports(); } );
	});
}


function dropTable(tableName)
{
	db.transaction(function(q) { q.executeSql("drop table " + tableName); });
}

function initialAreas()
{
	var exec = function(text)
	{
		db.transaction(function(q) { q.executeSql(text); }); 
	};
	
	exec(
	"create table area (area_id integer primary key, name text not null)"
	);
	db.transaction(
	function(q)
	{
		q.executeSql("insert into area (area_id, name) select 1, 'area_1' union all select 2, 'area_2' union all select 3, 'area_3'");
	});
	
	}

function  Reporttable(){
	
	var exec = function(text)
	{
		db.transaction(function(q) { q.executeSql(text); }); 
	};
	
	exec(
			"create table report (report_id integer primary key autoincrement, area_name String not null, title text not null, report_text text not null, filename String not null, position String, date Date, foreign key (area_name) references area (area_name))"
					);
	}

function addFile()
{
 
	var fileInput = document.getElementById("openFile");
	
	var file = fileInput.files[0];
	
	var reader = new FileReader();
	
		 reader.onload = (function(theFile) {
		        return function(e) {
		          // Render thumbnail.
		          var span = document.createElement('span');
		          span.innerHTML = ['<img class="thumb" src="', e.target.result,
		                            '" title="', escape(theFile.name), '"/>'].join('');
		          document.getElementById('list').insertBefore(span, null);
		        };
		      })(file);
		
	reader.readAsDataURL(file);
//acquire all the file name
		 fullname=document.getElementById("openFile").value;
		 filename[fi]=new String(fullname.substring(fullname.lastIndexOf('\\') + 1));
		 fi++;
		 myJsonString1 = JSON.stringify(filename);
		alert(myJsonString1);
		
		getLocation ();
		//empty the input value
		var obj = document.getElementById('openFile') ;   
		obj.outerHTML=obj.outerHTML; 
		
		//add video
		/*
		videofullname=document.getElementById("openVideo").value;
		videoname[fi]=new String(videofullname.substring(videofullname.lastIndexOf('\\') + 1));
		alert(videoname);
		document.getElementById('videolist').writeln(videoname);
		*/
}
  
function Clearlist(){
	
	var imagelist=document.getElementById("list");
	imagelist.innerHTML = "";
	 
	
}
//get current position via GRS(no network)
function getLocation (){
	
	if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(getPosition,showError);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
	
function getPosition(po){
		
	lat=po.coords.latitude;
	  lon=po.coords.longitude;
		position=""+lat+","+lon+"";
	}
function showError(error)
{
switch(error.code) 
  {
  case error.PERMISSION_DENIED:
    x.innerHTML="User denied the request for Geolocation.";
    break;
  case error.POSITION_UNAVAILABLE:
    x.innerHTML="Location information is unavailable.";
    break;
  case error.TIMEOUT:
    x.innerHTML="The request to get user location timed out.";
    break;
  case error.UNKNOWN_ERROR:
    x.innerHTML="An unknown error occurred.";
    break;
  }
}








