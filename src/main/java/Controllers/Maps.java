package Controllers;

import static Controllers.DatabaseHandler.hash;
import static Server.ServerStarter.database;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("maps/")
public class Maps {
    @POST
    @Path("insert")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insert (@FormDataParam("username") String username, @FormDataParam("mapName") String mapName) {

    }
}
