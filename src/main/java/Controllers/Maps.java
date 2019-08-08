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
    public static int getMapID (String mapName, String username) {
        try {
            PreparedStatement getMapID = database.prepareStatement("SELECT mapID FROM maps WHERE mapName=? AND username=?");
            getMapID.setString(1, mapName);
            getMapID.setString(2, username);
            ResultSet resultSet = getMapID.executeQuery();
            return resultSet.getInt(1);
        } catch (Exception e) {
            System.out.println("Failed to get mapID");
            return -1;
        }
    }
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertMapData (@CookieParam("sessionToken") Cookie sessionToken, @FormDataParam("mapName") String mapName, @FormDataParam("mapData") String mapData) {
        try {
            String username = Users.validateCookieMonster(sessionToken);
            if (username != null) {
                int mapID = getMapID(mapName, username);

                if (mapID != -1) {  // if map already exists then delete everything related to that map
                    database.setAutoCommit(false);

                    PreparedStatement deleteBlocks = database.prepareStatement("DELETE FROM blocks WHERE mapID=?");
                    deleteBlocks.setInt(1, mapID);
                    deleteBlocks.executeUpdate();

                    PreparedStatement deleteEnemies = database.prepareStatement("DELETE FROM enemies WHERE mapID=?");
                    deleteEnemies.setInt(1, mapID);
                    deleteEnemies.executeUpdate();

                    PreparedStatement deleteScores = database.prepareStatement("DELETE FROM scores WHERE mapID=?");
                    deleteScores.setInt(1, mapID);
                    deleteScores.executeUpdate();

                    PreparedStatement deleteSprite = database.prepareStatement("DELETE FROM sprites WHERE mapID=?");
                    deleteSprite.setInt(1, mapID);
                    deleteSprite.executeUpdate();

                    PreparedStatement deleteTux = database.prepareStatement("DELETE FROM tuxs WHERE mapID=?");
                    deleteTux.setInt(1, mapID);
                    deleteTux.executeUpdate();

                    PreparedStatement deleteMap = database.prepareStatement("DELETE FROM maps WHERE mapID=?");
                    deleteMap.setInt(1, mapID);
                    deleteMap.executeUpdate();

                    database.commit();
                    database.setAutoCommit(true);
                }

                PreparedStatement insertMap = database.prepareStatement("INSERT INTO maps (mapName, username) VALUES (?, ?)");
                insertMap.setString(1, mapName);
                insertMap.setString(2, username);
                insertMap.executeUpdate();

                mapID = getMapID(mapName, username);

                JSONObject jsonObject = new JSONObject(mapData);
                database.setAutoCommit(false);

                JSONArray blockArray = jsonObject.getJSONArray("blocks");
                for (int i = 0; i < blockArray.length(); i++) {
                    PreparedStatement ps = database.prepareStatement("INSERT INTO blocks (mapID, type, x, y) VALUES (?, ?, ?, ?)");
                    ps.setInt(1, mapID);
                    ps.setString(2, blockArray.getJSONObject(i).getString("type"));
                    ps.setInt(3, blockArray.getJSONObject(i).getInt("x"));
                    ps.setInt(4, blockArray.getJSONObject(i).getInt("y"));
                    ps.execute();
                }

                JSONArray enemyArray = jsonObject.getJSONArray("enemies");
                for (int i = 0; i < enemyArray.length(); i++) {
                    PreparedStatement ps = database.prepareStatement("INSERT INTO enemies (mapID, x, y) VALUES (?, ?, ?)");
                    ps.setInt(1, mapID);
                    ps.setInt(2, enemyArray.getJSONObject(i).getInt("x"));
                    ps.setInt(3, enemyArray.getJSONObject(i).getInt("y"));
                    ps.execute();
                }

                PreparedStatement pss = database.prepareStatement("INSERT INTO sprites (mapID, x, y) VALUES (?, ?, ?)");
                JSONObject spriteObject = jsonObject.getJSONObject("sprite");
                pss.setInt(1, mapID);
                pss.setInt(2, spriteObject.getInt("x"));
                pss.setInt(3, spriteObject.getInt("y"));
                pss.execute();

                PreparedStatement pst = database.prepareStatement("INSERT INTO tuxs (mapID, x, y) VALUES (?, ?, ?)");
                JSONObject tuxObject = jsonObject.getJSONObject("tux");
                pst.setInt(1, mapID);
                pst.setInt(2, tuxObject.getInt("x"));
                pst.setInt(3, tuxObject.getInt("y"));
                pst.execute();

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
        int mapID;
        System.out.println("Serving map| mapOwner: " + mapOwner + " | mapName: " + mapName);

        mapID = getMapID(mapName, mapOwner);

        PreparedStatement bps = database.prepareStatement("SELECT type, x, y FROM blocks WHERE mapID = ?");
        bps.setInt(1, mapID);
        ResultSet blockResults = bps.executeQuery();
        JSONArray blockArray = new JSONArray();
        while (blockResults.next()) {               // getting block data
            JSONObject blockObject = new JSONObject();
            blockObject.put("type", blockResults.getString("type"));
            blockObject.put("x", blockResults.getInt("x"));
            blockObject.put("y", blockResults.getInt("y"));
            blockArray.put(blockObject);
        }

        PreparedStatement eps = database.prepareStatement("SELECT x, y FROM enemies WHERE mapID = ?");
        eps.setInt(1, mapID);
        ResultSet enemyResults = eps.executeQuery();
        JSONArray enemyArray = new JSONArray();
        while (enemyResults.next()) {              // getting enemy data
            JSONObject enemyObject = new JSONObject();
            enemyObject.put("x", enemyResults.getInt("x"));
            enemyObject.put("y", enemyResults.getInt("y"));
            enemyArray.put(enemyObject);
        }

        PreparedStatement sps = database.prepareStatement("SELECT x, y FROM sprites WHERE mapID = ?");
        sps.setInt(1, mapID);
        ResultSet spriteResult = sps.executeQuery();
        spriteResult.next();                    // getting sprite data
        JSONObject spriteObject = new JSONObject();
        spriteObject.put("x", spriteResult.getInt("x"));
        spriteObject.put("y", spriteResult.getInt("y"));

        PreparedStatement tps = database.prepareStatement("SELECT x, y FROM tuxs WHERE mapID = ?");
        tps.setInt(1, mapID);
        ResultSet tuxResult = tps.executeQuery();
        tuxResult.next();
        JSONObject tuxObject = new JSONObject();
        tuxObject.put("x", tuxResult.getInt("x"));
        tuxObject.put("y", tuxResult.getInt("y"));

        JSONObject mapData = new JSONObject();

        mapData.put("blocks", blockArray);
        mapData.put("enemies", enemyArray);
        mapData.put("sprite", spriteObject);
        mapData.put("tux", tuxObject);
        mapData.put("mapID", mapID);

        return mapData.toString();
        // mapData has blocks, enemies, sprites, tuxs and mapID
        //return "{'blocks': " + blockArray + ", 'enemies': " + enemyArray + ", 'sprite': " + spriteObject + "}";
    }
}
