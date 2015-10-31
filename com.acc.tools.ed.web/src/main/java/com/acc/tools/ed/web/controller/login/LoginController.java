package com.acc.tools.ed.web.controller.login;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.acc.tools.ed.integration.dto.EDBUser;
import com.acc.tools.ed.integration.dto.ProjectForm;
import com.acc.tools.ed.integration.dto.ResourceDetails;
import com.acc.tools.ed.integration.dto.TaskForm;
import com.acc.tools.ed.integration.service.ILoginService;
import com.acc.tools.ed.report.dto.WeeklyStatusReportData;
import com.acc.tools.ed.web.controller.common.AbstractEdbBaseController;

/**
 * 
 * @author nikhil.jagtiani
 *
 */

@Controller
@SessionAttributes({ "edbUser"})
public class LoginController extends AbstractEdbBaseController{
	
	private static final Logger LOG=LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private ILoginService iLoginService;
	
/*	@Autowired
	private ProjectWorkService projectWorkService;*/
	
	@Value("${build}")
	private String environment;
	
	


	@RequestMapping(value="/start.do", method=RequestMethod.GET)
	public String pageLogin(Model model,HttpServletRequest request){
		
		if(environment.equalsIgnoreCase("DEV")){
			model.addAttribute("edbUser", new EDBUser());
			model.addAttribute("addProjectForm",new ProjectForm());
			model.addAttribute("addTaskForm",new TaskForm());
			model.addAttribute("editProjectForm", new ProjectForm());
			model.addAttribute("addEmpDetailsForm",new ResourceDetails());
			model.addAttribute("updateEmpDetailsForm",new ResourceDetails());
			model.addAttribute("statusForm",new WeeklyStatusReportData());
		return "login/index";
		} else {
			return "redirect:/login.do";
		}
			
	}
	
	@RequestMapping(value="/login.do")
	public String handleLogins(Principal principal,
			Model model,
			
			@RequestParam(required = false) String password,
			@RequestParam(required = false) Long lastLoginForm,
			final RedirectAttributes redirectAttributes,HttpSession session
			) throws Exception{
		//@RequestParam(required = false) Date lastLoginForm,
		//long lastLoginForm = System.currentTimeMillis();
		EDBUser user=null;
		String userName=System.getProperty("user.name");
		
		boolean isAdmin=isAdmin();
		String enterpriseId=principal.getName();
		if(environment.equalsIgnoreCase("DEV") && enterpriseId!=null){
			userName=enterpriseId;
			isAdmin=true;
		}
		
			user=iLoginService.searchUser(userName);
			if(user!=null && user.getEmployeeId()!=null){
				session.setAttribute("edbUser", user);
				model.addAttribute("edbUser", user);
				if(user.getPasswordFlag().equalsIgnoreCase("YES")){
				
					//session attributes
					model.addAttribute("edbUser", user);
					model.addAttribute("addProjectForm",new ProjectForm());
					model.addAttribute("addTaskForm",new TaskForm());
					model.addAttribute("editProjectForm", new ProjectForm());
					model.addAttribute("addEmpDetailsForm",new ResourceDetails());
					model.addAttribute("updateEmpDetailsForm",new ResourceDetails());
					model.addAttribute("statusForm",new WeeklyStatusReportData());
					/*List<ProjectForm> projData=projectWorkService.getMyTasks(user.getEmployeeId());
					model.addAttribute("projData",projData);*/
//					iLoginService.updateLogin(lastLoginForm,user.getEmployeeId());
					LOG.debug("Login - Adding user to session - User Id:[{}] Role:[{}]",user.getEmployeeId(),user.getRole());
					return "projectmanagement/index";
				}
				else
				{
					redirectAttributes.addFlashAttribute("status", "Please change your default password to new one!");
					redirectAttributes.addFlashAttribute("edbUser", user);
					System.out.println("user id ::"+ user.getEmployeeId());
					return "redirect:/loadUpdatePwd.do";
				}
					
				
			}else {
				redirectAttributes.addFlashAttribute("status", "User Not Registered!Please reach out to your supervisor!");
				//model.addAttribute("status", "User Not Registered!Please reach out to your supervisor!");
				return "redirect:/loginError.do";
			}
		}
	
	
	@RequestMapping(value="/loginError.do")
	public String loginError(@ModelAttribute("status") final String status,Model model){
		model.addAttribute("status", status);
		return "login/index";
	}
	
	
	
	@SuppressWarnings("restriction")
	public static boolean isAdmin() {
	    String groups[] = (new com.sun.security.auth.module.NTSystem()).getGroupIDs();
	    for (String group : groups) {
	        if (group.equals("S-1-5-32-544"))
	            return true;
	    }
	    return false;
	}

	@RequestMapping(value="/logout.do")
	public String logout(Model model, HttpSession session, SessionStatus sessionStatus ) throws Exception{
		if(!sessionStatus.isComplete()){
			EDBUser user = (EDBUser) session.getAttribute("edbUser");
			iLoginService.updateLogout(user.getEmployeeId());
			session.removeAttribute("edbUser");
			session.invalidate();
			sessionStatus.setComplete();
			model.addAttribute("status", "You have been logged out successfully");
		} 		
		return "login/index";
	}
	
	@RequestMapping(value = "/loadUpdatePwd.do")
	public String loadUpdatePassword(
			
			Model model){
		return "/login/changePassword";
	}
	
	 @RequestMapping(value = "/updatePwd.do",method=RequestMethod.POST)
		public  String updatePassword(
				@RequestParam("newPassword") String newPassword,
				@RequestParam("oldPassword") String oldPassword,
				
				@ModelAttribute("edbUser") EDBUser edbUser,HttpSession session,
				Model model){
		 edbUser= (EDBUser)session.getAttribute("edbUser");
			LOG.debug("User :{}",edbUser.getEmployeeId());
			
			LOG.debug("newPassword :{}",newPassword);
			iLoginService.updatePassword(newPassword,edbUser.getEmployeeId());
			
			model.addAttribute("edbUser", edbUser);
			model.addAttribute("addProjectForm",new ProjectForm());
			model.addAttribute("addTaskForm",new TaskForm());
			model.addAttribute("editProjectForm", new ProjectForm());
			model.addAttribute("addEmpDetailsForm",new ResourceDetails());
			model.addAttribute("updateEmpDetailsForm",new ResourceDetails());
			model.addAttribute("statusForm",new WeeklyStatusReportData());
			/*List<ProjectForm> projData=projectWorkService.getMyTasks(edbUser.getEmployeeId());
			model.addAttribute("projData",projData);*/
//			iLoginService.updateLogin(lastLoginForm,user.getEmployeeId());
			return "/projectmanagement/index";
		}
}
