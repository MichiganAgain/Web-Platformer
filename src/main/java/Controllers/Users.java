package Controllers;

import static Controllers.DatabaseHandler.hash;
import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("users/")
public class Users {
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String insert (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, hash(password));
            ps.execute();
            System.out.println("Inserted into users table");
            return "{\"success\": \"logged in as valid admin\"}";

        } catch (Exception e) {
            System.out.println("Failed to insert into users table");
            return "{\"error\": \"Not logged in as valid admin\"}";
        }
    }

    @GET
    @Path("select")
    @Produces(MediaType.APPLICATION_JSON)
    public String selectUsernames () {
        try {
            PreparedStatement ps = database.prepareStatement("SELECT username FROM users");
            ResultSet resultSet = ps.executeQuery();

            JSONArray jsonArray = new JSONArray();
            while (resultSet.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("username", resultSet.getString(1));
                jsonArray.put(jsonObject);
            }
            return jsonArray.toString();

        } catch (Exception e) {
            System.out.println("Failed to select from the users table");
            return "{\"error\": \"Failed to select from the users table\"}";
        }
    }
}
