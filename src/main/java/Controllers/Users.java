package Controllers;

import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;
/*
insert -
validateCookie -
verify -
checkLogin - when users go on site that they MUST have an account for
             Intertwined with validateCookie??
*/
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;
import javax.ws.rs.core.Cookie;
import javax.xml.transform.Result;

@Path("users/")
public class Users {
    public static String hash (String plainText) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
            byte[] data = messageDigest.digest(plainText.getBytes());
            BigInteger bigInteger = new BigInteger(1, data);
            return bigInteger.toString(16);

        } catch (Exception e) {
            System.out.println("Failed to hash string");
            return null;
        }
    }

    @POST
    @Path("register")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String register (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement checkExisting = database.prepareStatement("SELECT username FROM users WHERE username = ?");
            checkExisting.setString(1, username);
            ResultSet resultSet = checkExisting.executeQuery();

            if (resultSet.next()) return "{\"error\": \"error username taken\"}";

            PreparedStatement ps = database.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, hash(password));
            ps.execute();
            System.out.println("Inserted into users table: " + username);
            return "{\"success\": \"successfully added user\"}";

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "{\"error\": \"error during database query\"}";
        }
    }

    @POST
    @Path("login") // verify user on login and give them sessionToken
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String login (@FormDataParam("username") String username, @FormDataParam("password") String password) {
        try {
            PreparedStatement ps = database.prepareStatement("SELECT password FROM users WHERE username=?");
            ps.setString(1, username);
            ResultSet resultSet = ps.executeQuery();

            if (resultSet.next()) {
                if (resultSet.getString(1).equals(hash(password))) {
                    String token = UUID.randomUUID().toString();
                    PreparedStatement ps2 = database.prepareStatement("UPDATE users SET sessionToken = ? WHERE username = ?");
                    ps2.setString(1, token);
                    ps2.setString(2, username);
                    ps2.executeUpdate();
                    return "{\"token\": \"" + token + "\"}";
                } else {
                    return "{\"error\": \"Error: password incorrect\"}";
                }
            } else {
                return "{\"error\": \"Error: user doesn't exist\"}";
            }

        } catch (Exception e) {
            System.out.println("Failed to select from the users table");
            return "{\"error\": \"Failed to select from the users table\"}";
        }
    }

    @POST
    @Path("logout")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public static String logout (@CookieParam("sessionToken") Cookie sessionCookie) {
        try {
            if (sessionCookie != null) {
                String token = sessionCookie.getValue();
                PreparedStatement ps = database.prepareStatement("UPDATE users SET sessionToken=NULL WHERE sessionToken=?");
                ps.setString(1, token);
                ps.executeUpdate();
                return "{\"success\": \"Successfully removed sessionCookie from database\"}";
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return "{\"error\": \"Failed to remove sessionCookie from database\"}";
    }

    public static String validateCookie (Cookie cookieSession) {
        if (cookieSession != null) {
            try {
                String sessionToken = cookieSession.getValue();
                PreparedStatement ps = database.prepareStatement("SELECT username FROM users WHERE sessionToken = ?");
                ps.setString(1, sessionToken);
                ResultSet rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    return rs.getString("username");
                }

            } catch (Exception e) {
                System.out.println("Error selecting cookie-kun from users");
            }
        }
        return null;
    }

    @GET
    @Path("check")
    @Produces(MediaType.APPLICATION_JSON)
    public String checkLogin (@CookieParam("sessionToken") Cookie sessionCookie) {
        String user = validateCookie(sessionCookie);
        return (user == null) ? "{\"error\": \"Invalid user session token\"}": "{\"username\": \"" + user + "\"}";
    }
}