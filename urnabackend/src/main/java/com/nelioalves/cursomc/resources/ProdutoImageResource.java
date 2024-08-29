package com.nelioalves.cursomc.resources;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import com.nelioalves.cursomc.domain.ProdutoImage;
import com.nelioalves.cursomc.services.ProdutoImagemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping(value = "/api/produtoimages")
public class ProdutoImageResource {

    @Autowired
    private ProdutoImagemService service;

    @GetMapping("/getphoto/{productId}")
    public ResponseEntity<ByteArrayResource> getPhotoOfProduct(@PathVariable Integer productId) {
        // Get the image file path based on the product ID
        //String imagePath = "/path/to/images/" + productId + ".jpg"; // Adjust the path as needed
    	 List<ProdutoImage> produtoImages = service.findbyProdutoId(productId);
    	 ProdutoImage produto = produtoImages.get(0);
    	 
        try {
            Path path = Paths.get(produto.getImagePath());
            byte[] imageBytes = Files.readAllBytes(path);

            // Create a ByteArrayResource from the image bytes
            ByteArrayResource resource = new ByteArrayResource(imageBytes);

            // Return the image with appropriate headers
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + productId + ".jpg\"")
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
                    .contentLength(imageBytes.length)
                    .body(resource);
        } catch (IOException e) {
            // Handle file not found or IO exception
            return ResponseEntity.notFound().build();
        }
        
    }

    @GetMapping("/getphoto2/{productId}")
    public ResponseEntity<ByteArrayResource> getPhotoOfProduct2(@PathVariable Integer productId) {
        List<ProdutoImage> produtoImages = service.findbyProdutoId(productId);
        
        if (produtoImages.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProdutoImage produtoImage = produtoImages.get(0);

        try {
            Path path = Paths.get(produtoImage.getImagePath());
            byte[] imageBytes = Files.readAllBytes(path);

            // Determine content type
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Determine file name
            String fileName = path.getFileName().toString();

            // Create a ByteArrayResource from the image bytes
            ByteArrayResource resource = new ByteArrayResource(imageBytes);

            // Return the image with appropriate headers
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .contentLength(imageBytes.length)
                    .body(resource);
        } catch (IOException e) {
            // Handle file not found or IO exception
            return ResponseEntity.notFound().build();
        }
    }

}
