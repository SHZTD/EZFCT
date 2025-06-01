
import PropTypes from 'prop-types';
import ButtonComp from './ButtonComp.jsx';

const NavTabs = ({ activeTab, loaded, tabs, onTabChange }) => (
  <div className={`nav-tabs ${loaded?'loaded':''}`}>
    {tabs.map(tab => (
      <ButtonComp
        key={tab.key}
        className={`tab-button ${activeTab===tab.key?'active':''}`}
        icon={<img src={tab.icon} alt={tab.label} className="tab-icon" />}
        onClick={() => onTabChange(tab.key, tab.route)}
      >
        {tab.label}
      </ButtonComp>
    ))}
  </div>
);

NavTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string, icon: PropTypes.string,
    label: PropTypes.string, route: PropTypes.string
  })).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default NavTabs;
