package Controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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
            String hashedText = bigInteger.toString();
            return hashedText;

        } catch (Exception e) {
            System.out.println("Failed to has string");
            return null;
        }
    }

    @POST
    @Path("userTable/insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public static void insert (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("INSERT INTO userTable (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, password);
            ps.execute();
            System.out.println("Inserted into userTable database");

        } catch (Exception e) {
            System.out.println("Failed to insert into database");
        }
    }
}
