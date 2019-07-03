package Controllers;

import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;

import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("maps/")
public class Maps {
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertMapData (@CookieParam("sessionToken") Cookie sessionToken, @FormDataParam("mapName") String mapName, @FormDataParam("mapData") String mapData) {
        try {
            String username = Users.validateCookieMonster(sessionToken);
            if (username != null) {
                //first create map, worry about updates later
                PreparedStatement insertMap = database.prepareStatement("INSERT INTO maps (mapName, username) VALUES (?, ?)");
                insertMap.setString(1, mapName);
                insertMap.setString(2, username);
                insertMap.executeUpdate();

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
                for (int i = 0; i < enemyArray.length(); i++) {
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
            }
            else {
                System.out.println("User not logged in");
                return "{\"error\": \"Not logged in\"}";
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "{\"error\": \"failed to insert map data\"}";
        }
    }

    @POST
    @Path("getMap")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String getMap (@FormDataParam("mapOwner") String mapOwner, @FormDataParam("mapName") String mapName) throws Exception {
        System.out.println(mapOwner + "  " + mapName);

        PreparedStatement bps = database.prepareStatement("SELECT type, x, y FROM blocks WHERE mapName = ?");
        bps.setString(1, mapName);
        ResultSet blockResults = bps.executeQuery();
        JSONArray blockArray = new JSONArray();
        while (blockResults.next()) {
            JSONObject blockObject = new JSONObject();
            blockObject.put("type", blockResults.getString("type"));
            blockObject.put("x", blockResults.getInt("x"));
            blockObject.put("y", blockResults.getInt("y"));
            blockArray.put(blockObject);
        }

        PreparedStatement eps = database.prepareStatement("SELECT x, y FROM enemies WHERE mapName = ?");
        eps.setString(1, mapName);
        ResultSet enemyResults = eps.executeQuery();
        JSONArray enemyArray = new JSONArray();
        while (enemyResults.next()) {
            JSONObject enemyObject = new JSONObject();
            enemyObject.put("x", enemyResults.getInt("x"));
            enemyObject.put("y", enemyResults.getInt("y"));
            enemyArray.put(enemyObject);
        }

        PreparedStatement sps = database.prepareStatement("SELECT x, y FROM sprites WHERE mapName = ?");
        sps.setString(1, mapName);
        ResultSet spriteResult = sps.executeQuery();
        spriteResult.next();
        JSONObject spriteObject = new JSONObject();
        spriteObject.put("x", spriteResult.getInt("x"));
        spriteObject.put("y", spriteResult.getInt("y"));

        JSONObject mapData = new JSONObject();

        mapData.put("blocks", blockArray);
        mapData.put("enemies", enemyArray);
        mapData.put("sprite", spriteObject);

        return mapData.toString();
        //return "{'blocks': " + blockArray + ", 'enemies': " + enemyArray + ", 'sprite': " + spriteObject + "}";
    }
}
