import { Button } from 'antd';

export interface IUserProps {

}

const User: React.FC<IUserProps> = () => (
  <div>
    user
    <Button type="primary">
      hello
    </Button>
  </div>
);

export default User;
