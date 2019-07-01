package Controllers;

import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("users/")
public class Users {
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
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String insert (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, hash(password));
            ps.execute();
            System.out.println("Inserted into users table");
            return "{\"success\": \"successfully added user\"}";

        } catch (Exception e) {
            System.out.println("Failed to insert into users table");
            return "{\"error\": \"taken\"}";
        }
    }

    @POST
    @Path("select")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String selectUsernames (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("SELECT * FROM users WHERE username=? AND password=?");
            ps.setString(1, username);
            ps.setString(2, hash(password));
            ResultSet resultSet = ps.executeQuery();

            int resultCount = 0;
            while (resultSet.next()) resultCount++;
            return (resultCount == 1) ? "{\"success\": \"user exists\"}" : "{\"error\": \"user doesn't exist\"}";

        } catch (Exception e) {
            System.out.println("Failed to select from the users table");
            return "{\"error\": \"Failed to select from the users table\"}";
        }
    }
}
