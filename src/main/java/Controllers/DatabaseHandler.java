package Controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.sql.PreparedStatement;

import static Server.ServerStarter.database;
@Path("database/")
public class DatabaseHandler {
    @POST
    @Path("mapTable/insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public static void insertMapData (@FormDataParam("username") String username, @FormDataParam("mapData") String mapData) {
        try {
            System.out.println(mapData);
            JSONObject jsonObject = new JSONObject(mapData);

            JSONArray jsonArray = jsonObject.getJSONArray("blocks");
            for (int i = 0; i < jsonArray.length(); i++) {
                System.out.println(jsonArray.getJSONObject(i).getInt("x"));
            }
            jsonArray = jsonObject.getJSONArray("enemies");
            for (int i = 0; i < jsonArray.length(); i++) {
                System.out.println(jsonArray.getJSONObject(i).getInt("x"));
            }

        } catch (Exception e) {
            System.out.println("Failed to insert into database");
        }
    }
}
