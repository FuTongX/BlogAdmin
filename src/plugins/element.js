import Vue from "vue";
import {
  Form,
  FormItem,
  Avatar,
  Input,
  Button,
  Card,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Radio,
  RadioGroup,
  DatePicker,
  Select,
  Option,
  RadioButton,
  CheckboxButton,
  CheckboxGroup,
  Checkbox,
  Table,
  TableColumn,
  Tag,
  Switch,
  Link,
  Tabs,
  TabPane,
  Dialog,
  MessageBox,
  Tree,
  Image,
  Cascader,
  Descriptions,
  DescriptionsItem,
  Divider,
  Pagination
} from "element-ui";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Avatar);
Vue.use(Input);
Vue.use(Button);
Vue.use(Card);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Footer);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Link);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(RadioButton);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Dialog);
Vue.use(Tree);
Vue.use(Image);
Vue.use(Cascader);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Divider);
Vue.use(Pagination);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
