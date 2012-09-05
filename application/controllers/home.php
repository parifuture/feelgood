<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Home extends CI_Controller {

    function __construct() {
        parent::__construct();
        unset($user);
    }

    function index() {

        $user = $this->facebook->getUser();
        $friends = array();
        $likes = array();

        if ($user) {
            try {
                $data['friends'] = $this->getUserFriends();
                $data['likes'] = $this->getUserLikes();
                $data['graph'] = array();
            } catch (FacebookApiException $e) {
                $user = null;
            }
        }

        if ($user) {
            $data['logout_url'] = $this->facebook->getLogoutUrl();
        } else {
            $data['login_url'] = $this->facebook->getLoginUrl();
        }
        
        // foreach ($data['likes'] as $key=>$value){
          // $data['graph'][$value['id']] = $value['name'].','.$value['category']; 
        // }
        
        $this->load->view('header');
        $this->load->view('main',$data);
    }
    
    function getUserLikes($userid = 'me') {
      $user = $this->facebook->getUser();
      if ($user) {
        $likes = $this->facebook->api('/'.$userid.'/likes');
      }
      return $likes;
    }
    
    function getUserFriends($userid = 'me') {
      $user = $this->facebook->getUser();
      if ($user) {
        $temp = $this->facebook->api('/'.$userid.'/friends');
      }
      foreach($temp as $key => $value){
        $friends[$value['id']] = $value['name'];
      }
      return $friends;
    }    
}