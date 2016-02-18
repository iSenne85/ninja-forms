<?php if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Class NF_Fields_ListState
 */
class NF_Fields_ListState extends NF_Abstracts_List
{
    protected $_name = 'liststate';

    protected $_type = 'liststate';

    protected $_nicename = 'State';

    protected $_section = 'userinfo';

    protected $_templates = array( 'liststate', 'listselect' );

    protected $_old_classname = 'list-select';

    public function __construct()
    {
        parent::__construct();

        $this->_nicename = __( 'State', 'ninja-forms' );
    }
}
