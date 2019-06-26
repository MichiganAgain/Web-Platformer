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
    public static String hash (String plainText) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
            byte[] data = messageDigest.digest(plainText.getBytes());
            BigInteger bigInteger = new BigInteger(1, data);
            return bigInteger.toString(16);

        } catch (Exception e) {
            System.out.println("Failed to has string");
            return null;
        }
    }

    @POST
    @Path("userTable/insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public static void insert (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, hash(password));
            ps.execute();
            System.out.println("Inserted into userTable database");

        } catch (Exception e) {
            System.out.println("Failed to insert into database");
        }
    }

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
