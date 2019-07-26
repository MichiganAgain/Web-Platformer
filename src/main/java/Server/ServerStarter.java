package Server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.sqlite.SQLiteConfig;

import java.sql.Connection;
import java.sql.DriverManager;

public class ServerStarter {
    public static Connection database = null;

    public static void main (String args[]) {
        connect("myDatabase2.db");

        ResourceConfig resourceConfig = new ResourceConfig();
        resourceConfig.packages("Controllers");
        resourceConfig.register(MultiPartFeature.class);
        ServletHolder servletHolder = new ServletHolder(new ServletContainer(resourceConfig));

        Server server = new Server(8080);
        ServletContextHandler contextHandler = new ServletContextHandler(server, "/*");
        contextHandler.addServlet(servletHolder, "/*");

        try {
            server.start();
            System.out.println("Started server");
            server.join();

        } catch (Exception e) {
            System.out.println("Failed to start server");
        }
        disconnect();
    }

    public static void connect (String databaseName) {
        try {
            Class.forName("org.sqlite.JDBC");
            SQLiteConfig sqLiteConfig = new SQLiteConfig();
            sqLiteConfig.enforceForeignKeys(true)git

            database = DriverManager.getConnection("jdbc:sqlite:resources/" + databaseName, sqLiteConfig.toProperties());
            System.out.println("Connected to database");

        } catch (Exception e) {System.out.println("Failed to connect to database");}
    }

    public static void disconnect () {
        try {
            database.close();
            System.out.println("Database closed");

        } catch (Exception e) { System.out.println("Failed to close database"); }
    }
}