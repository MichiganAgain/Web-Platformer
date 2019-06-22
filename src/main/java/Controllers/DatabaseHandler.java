package Controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
            return bigInteger.toString();

        } catch (Exception e) {
            System.out.println("Failed to has string");
            return null;
        }
    }

    @POST
    @Path("{tableName}/insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public static void insert (@PathParam("tableName") String tableName, @FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("INSERT INTO ? (username, password) VALUES (?, ?)");
            ps.setString(1, tableName);
            ps.setString(2, username);
            ps.setString(3, password);
            ps.execute();
            System.out.println("Inserted into userTable database");

        } catch (Exception e) {
            System.out.println("Failed to insert into database");
        }
    }
}
