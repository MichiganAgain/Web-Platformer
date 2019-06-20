package Controllers;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;

@Path("client/")
public class ClientHandler {
    public static byte[] getFile (String path) {
        try {
            File file = new File(path);
            byte[] data = new byte[(int) file.length()];
            DataInputStream dis = new DataInputStream(new FileInputStream(file));
            dis.readFully(data);
            dis.close();
            return data;

        } catch (Exception e) {
            System.out.println("Failed to read file");
            return null;
        }
    }

    @GET
    @Path("{path}")
    @Produces("text/html")
    public static byte[] getHTML (@PathParam("path") String path) {
        System.out.println("Serving HTML");
        return getFile("resources/website/" + path);
    }

    @GET
    @Path("JS/{path}")
    @Produces("text/javascript")
    public static byte[] getJS (@PathParam("path") String path) {
        System.out.println("Serving JavaScript");
        return getFile("resources/website/JS/" + path);
    }

    @GET
    @Path("CSS/{path}")
    @Produces("text/css")
    public static byte[] getCSS (@PathParam("path") String path) {
        System.out.println("Serving CSS");
        return getFile("resources/website/CSS/" + path);
    }
}
