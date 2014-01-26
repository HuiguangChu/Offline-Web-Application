package jaxrs;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
//import javax.ws.rs.GET;
import javax.ws.rs.POST;
//import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mysql.jdbc.ResultSetMetaData;



// Java class will be hosted at the URI path //"/database"
@Path("/database")
public class Resource {
	public static String  message1;
	public static int  name1;
	public static String  name2="";
	public static String  name3="";
	public static String  name4="";
	public static String name5="";
	public static String name6="";
	public static String name7="";
 //  Java method will process HTTP GET requests
// Java method will produce content identified by the MIME Media
 // type "text/plain"
  @Produces(MediaType.TEXT_PLAIN)
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  @Path("{Info}")
  @POST
  //method must have a return value to the httpclient get request
  //JSONObject obj=new JSONObject();
     public static  String  getMessage (@FormParam("name")  String message ) throws JSONException
		                              
   { 
	  message1=message;
	  getMessage();
	  System.out.println("visited by sdsa");
	 System.out.println(message1);
	 return "1234";
	 }
public static void getMessage() throws JSONException {
	
	// TODO Auto-generated method stub
			// driver
			   String driver = "com.mysql.jdbc.Driver";
			// URL direction :hostname +databasename"huiguang"
			String url = "jdbc:mysql://mysql.stud.hig.no/s120556";
			// MySQL username
			String user = "s120556";
			// Java to MySQL password
			String password = "k72ZvQtY";
			try {
			// loading driver
			Class.forName(driver).newInstance();
			// connecting to the database
			Connection conn = DriverManager.getConnection(url, user, password);
			if(!conn.isClosed())
			System.out.println("Succeeded connecting to the Database!");
			// statement is used for executing SQL commmand
				Statement statement = conn.createStatement();
				JSONArray jObject = new JSONArray(message1);
			   for (int i = 0; i < jObject.length(); i++) {
		      JSONObject  menuObject = jObject.getJSONObject(i);
		      name1=Integer.parseInt(menuObject.getString("report_id"));
		      name2=menuObject.getString("area_name");
		      name3=menuObject.getString("title");
		      name4=menuObject.getString("report_text");
		      name5=menuObject.getString("filename");
		      name6=menuObject.getString("position");
		      name7=menuObject.getString("date");
		      System.out.println(name7);
		   // SQL command 
		     String sql = "insert into report(report_id,area_name,title,report_text,filename,geolocation,date) values("+name1+",'"+name2+"','"+name3+"','"+name4+"','"+name5+"','"+name6+"','"+name7+"')";
		      //String sql="Update report  SET report_id="+name1+",area_id="+name2+",name='"+name3+"',report_text='"+name4+"'";
		      int rs = statement.executeUpdate(sql);
		      System.out.println(rs);
			   }
			
		    conn.close();
			} catch(Exception e){
				
			}
	System.out.println("success");
  }


@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.TEXT_PLAIN)
@Path("position")
@GET
public String getpositon(String position){
	  JSONArray array = new JSONArray();
	  Date currenttime=new Date();
	  SimpleDateFormat mydate = new SimpleDateFormat("yyyy.M.d");
		String currentdate=mydate.format(currenttime);
		System.out.println(currentdate);
	// driver
	   String driver = "com.mysql.jdbc.Driver";
	// URL direction :hostname +databasename"huiguang"
	String url = "jdbc:mysql://mysql.stud.hig.no/s120556";
	// MySQL username
	String user = "s120556";
	// Java to MySQL password
	String password = "k72ZvQtY";
	try {
	// loading driver
	Class.forName(driver).newInstance();
	// connecting to the database
	Connection conn = DriverManager.getConnection(url, user, password);
	if(!conn.isClosed())
	System.out.println("Succeeded connecting to the Database!");
	// statement is used for executing SQL commmand
		Statement statement = conn.createStatement();
		String sql = "select * from report where date='"+currentdate+"'";
	    ResultSet rs = statement.executeQuery(sql);
	    //check the rows amount
	    /*
	   rs.last();
	    int rowcount = rs.getRow();
	    */
	   ResultSetMetaData metaData = (ResultSetMetaData) rs.getMetaData();  
	  String columnName =metaData.getColumnLabel(6);
	  String columnName2=metaData.getColumnLabel(5);
	      while(rs.next()){
	    	  JSONObject jsonObj = new JSONObject();
		    String value = rs.getString("geolocation");
		    String value2=rs.getString("filename");
		    jsonObj.put(columnName2, value2);
		    		jsonObj.put(columnName,value);
	        array.put(jsonObj);
	   //array.put(value);
	   }
	      //for (int i = 0; i < array.length(); i++) {
	    	  //System.out.println(array.getJSONObject(i)); 
	      //}
	      //System.out.println(array.getJSONObject(1));   
	System.out.println(array.length());
	      System.out.println(array);
	      /*
	      int length = array.length();
	      if (length > 0) {
	          String [] recipients = new String [length];
	          for (int i = 0; i < length; i++) {
	              recipients[i] = array.getString(i);
	              System.out.println(recipients[i]);
	              	String sql2 = "select * from report where date='"+currentdate+"'and geolocation='"+recipients[i]+"'";
	  		    	ResultSet rs2 = statement.executeQuery(sql2);
	  		    	while(rs2.next()){
	  			    String value = rs2.getString("filename");
	  			 array2.put(value);
	  			    }
	  		    }
	           }*/
	       conn.close();
		} catch(Exception e){
			
		}
	return array.toString();

}

}