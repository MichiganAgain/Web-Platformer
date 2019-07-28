package Controllers;

import static Controllers.Users.validateCookieMonster;
import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;
import java.time.LocalDate;
import javax.ws.rs.core.Cookie;

@Path("scores/")
public class Scores {
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public String insertScore (@CookieParam("sessionToken") Cookie sessionCookie, @FormDataParam("mapID") int mapID, @FormDataParam("score") float score) {
        try {
            String username = validateCookieMonster(sessionCookie);
            if (username != null) {
                LocalDate localDate = LocalDate.now();
                PreparedStatement ps = database.prepareStatement("INSERT INTO scores (username, mapID, score, date) VALUES (?, ?, ?, ?)");
                ps.setString(1, username);
                ps.setInt(2, mapID);
                ps.setFloat(3, score);
                ps.setString(4, date.toString());
                ps.execute();

                return "{\"success\": \"Successfully added score to the database\"}";
            } else {
                return "{\"error\": \"Invalid sessionCookie\"}";
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "{\"error\": \"Failed to insert score into database\"}";
        }
    }

    @GET
    @Path("getScores/{mapID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public static String getScores (@PathParam("mapID") int mapID) {
        try {
            PreparedStatement ps = database.prepareStatement("SELECT username, score, date FROM scores WHERE mapID=?");
            ps.setInt(1, mapID);
            ResultSet scoreResults = ps.executeQuery();

            JSONArray jsonArray = new JSONArray();
            while (scoreResults.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("username", scoreResults.getString("username"));
                jsonObject.put("score", scoreResults.getFloat("score"));
                jsonObject.put("date", scoreResults.getString("date"));
                jsonArray.put(jsonObject);
            }

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("scores", jsonArray);

            return jsonObject.toString();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
