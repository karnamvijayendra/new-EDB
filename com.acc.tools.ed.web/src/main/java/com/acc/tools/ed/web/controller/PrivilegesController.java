package com.acc.tools.ed.web.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.acc.tools.ed.web.dto.PrivilegesDTO;
import com.acc.tools.ed.web.dto.UserRoles;
import com.acc.tools.ed.web.service.PrivilegeService;

@Controller
public class PrivilegesController {

	@Autowired
	private PrivilegeService privilegesService;
	
	@RequestMapping(value="/privileges", method = RequestMethod.GET)
	   public ModelAndView getPrivileges(Model model) {
	      try {
	    	  
	    	  ObjectMapper mapper = new ObjectMapper();
	    	  List<PrivilegesDTO> allMenuList = privilegesService.getAllMenuList();
	    	  String jsonInString = mapper.writeValueAsString(allMenuList);
			model.addAttribute("menuList", jsonInString);
			
			List<UserRoles> userRoles = privilegesService.getUserRoles();
			model.addAttribute("userRoles", userRoles);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	      return  new ModelAndView("privileges","model", model);
	   }
	
	@RequestMapping(value="/getUserSpecificRoles",method = RequestMethod.POST)
	public @ResponseBody String getUserSpecificRoles(@RequestParam(required = false) String userRole,Model model){
		String roleSpecificMenus = null;
		try {
			System.out.println("User Role:"+ userRole);
			roleSpecificMenus = privilegesService.getRoleSpecificMenus(userRole);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(roleSpecificMenus);
		return roleSpecificMenus.isEmpty()?" ": roleSpecificMenus;
		
	}
	
	@RequestMapping(value="/updateUserSpecificRoles",method = RequestMethod.POST)
	public @ResponseBody String updateUserSpecificRoles(@RequestParam(required = false) String userRole,@RequestParam(required = false) String selectedMenu,Model model){
		String[] selectedMenuList = selectedMenu.split(",");
		String msg = null;
		System.out.println("Role:" + userRole);
		System.out.println("MenuList:" + selectedMenu);
		System.out.println("MenuList:" + selectedMenu.toString());
		try {
			msg = privilegesService.updateRoleSpecificMenus(userRole,selectedMenuList);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(msg);
		return msg;
		
	}
}
