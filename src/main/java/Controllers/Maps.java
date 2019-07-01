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

@Path("maps/")
public class Maps {
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertMapData (@FormDataParam("username") String username, @FormDataParam("mapData") String mapData, @FormDataParam("mapName") String mapName) {
        try {
            JSONObject jsonObject = new JSONObject(mapData);

            database.setAutoCommit(false);

            JSONArray blockArray = jsonObject.getJSONArray("blocks");
            for (int i = 0; i < blockArray.length(); i++) {
                PreparedStatement ps = database.prepareStatement("INSERT INTO blocks (mapName, type, x, y) VALUES (?, ?, ?, ?)");
                ps.setString(1, mapName);
                ps.setString(2, blockArray.getJSONObject(i).getString("type"));
                ps.setInt(3, blockArray.getJSONObject(i).getInt("x"));
                ps.setInt(4, blockArray.getJSONObject(i).getInt("y"));
                ps.execute();
            }

            JSONArray enemyArray = jsonObject.getJSONArray("enemies");
            for (int i = 0; i < blockArray.length(); i++) {
                PreparedStatement ps = database.prepareStatement("INSERT INTO enemies (mapName, x, y) VALUES (?, ?, ?)");
                ps.setString(1, mapName);
                ps.setInt(2, enemyArray.getJSONObject(i).getInt("x"));
                ps.setInt(3, enemyArray.getJSONObject(i).getInt("y"));
                ps.execute();
            }

            PreparedStatement ps = database.prepareStatement("INSERT INTO sprites (mapName, x, y) VALUES (?, ?, ?)");
            JSONObject spriteObject = jsonObject.getJSONObject("sprite");
            ps.setString(1, mapName);
            ps.setInt(2, spriteObject.getInt("x"));
            ps.setInt(3, spriteObject.getInt("y"));
            ps.execute();

            database.commit();
            database.setAutoCommit(true);

            return "{\"success\": \"successfully added map data\"}";

        } catch (Exception e) {
            System.out.println("Failed to insert into databases");
            return "{\"error\": \"failed to insert map data\"}";
        }
    }
}
