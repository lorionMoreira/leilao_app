package com.nelioalves.cursomc.services;

import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nelioalves.cursomc.domain.Produto;
import com.nelioalves.cursomc.domain.ProdutoImage;
import com.nelioalves.cursomc.domain.Sala;
import com.nelioalves.cursomc.repositories.ProdutoImagemRepository;
import com.nelioalves.cursomc.repositories.ProdutoRepository;
import com.nelioalves.cursomc.resources.exception.FileNotSupportedException;
import com.nelioalves.cursomc.resources.exception.FileSaveException;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
@Service
public class ProdutoImagemService {
	// melhorar a implementação do arquivo com : https://github.com/lokeshgupta1981/Spring-Boot-Examples/blob/master/spring-react-file-upload/SpringBootFileUploadApplication/src/main/java/com/boot/rest/base/payload/FileUploadResponse.java
	private static final String IMAGE_UPLOAD_PATH = "C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\images";
	
	public ProdutoImagemService() throws IOException {}
	
	String algo = new ClassPathResource("").getFile().getAbsolutePath()
    + File.separator + "static"
    + File.separator + "image";
	
	  private final Path UPLOAD_PATH =
		      Paths.get(new ClassPathResource("").getFile().getAbsolutePath()
		          + File.separator + "static"
		          + File.separator + "image");
	
	@Autowired
	private ProdutoImagemRepository repo;
	
	public ProdutoImage saveImage(MultipartFile file, Produto produto) {
		
		String namePath = IMAGE_UPLOAD_PATH + System.currentTimeMillis() + file.getOriginalFilename();
		
	    if (!Files.exists(UPLOAD_PATH)) {
	        try {
				Files.createDirectories(UPLOAD_PATH);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	      }
	    /*
	    // file format validation
	    if (!file.getContentType().equals("image/jpeg") && !file.getContentType().equals("image/png")) {
	      throw new FileNotSupportedException("only .jpeg and .png images are " + "supported");
	    }
	    */
	    
	    String timeStampedFileName = new SimpleDateFormat("ssmmHHddMMyyyy")
	            .format(new Date()) + "_" + file.getOriginalFilename();
	    
	    Path filePath = UPLOAD_PATH.resolve(timeStampedFileName);
	    
	    String namepath = filePath.toString();
		ProdutoImage productImage = new ProdutoImage();
		
        productImage.setProduto(produto);
        productImage.setImageName(file.getOriginalFilename());
        productImage.setImagePath(namepath);
        
        
        try {
            saveImageToFile2(file, filePath);
            
            
        } catch (IOException e) {
            // Handle exception
        	throw new FileSaveException("Could not save the image to file.", e);
        }

       return  repo.save(productImage);
	}
	
    private void saveImageToFile(MultipartFile file, String namePath) throws IOException {
    	
        Path imagePath = Paths.get(namePath);

        Files.write(imagePath, file.getBytes());
    }
    
    private void saveImageToFile2(MultipartFile file, Path filePath) throws IOException {
    	
        Files.write(filePath, file.getBytes());
    }
    
    // This method assumes a simple file storage structure, adjust as needed for your actual structure
    public File getImageFileByProdutoIdAndImageName(Integer produtoId, String imageName) {
        // Assuming images are stored in a directory named "images"
        String filePath = "/path/to/images/" + produtoId + "/" + imageName;
        File imageFile = new File(filePath);

        if (imageFile.exists() && imageFile.isFile()) {
            return imageFile;
        } else {
            return null;
        }
    }
    public List<ProdutoImage> findbyProdutoId(Integer produtoId) {
        return repo.findByProdutoId(produtoId);
    }
    /*
    public ProdutoImage findbyProdutoId (Integer productId) {
    	ProdutoImage obj = repo.findByProdutoId(productId);
		if (obj == null) {
			throw new ObjectNotFoundException(
					"Objeto não encontrado!  ");
		}
		return obj;
    }
    */
	
}
