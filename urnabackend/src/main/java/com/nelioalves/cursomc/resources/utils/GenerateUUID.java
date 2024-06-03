package com.nelioalves.cursomc.resources.utils;

import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class GenerateUUID {
	
    public static String getUUIDSTRING() {

        UUID uuid = UUID.randomUUID();
        String uuidString = uuid.toString();
        
        return uuidString;
    }
    
}
