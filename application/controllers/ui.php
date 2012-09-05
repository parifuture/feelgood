<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Ui extends CI_Controller {

    function __construct()
    {
        parent::__construct();
        unset($user);
    }

    function index()
    {
      $this->load->view('ui');
    }
    
}