import type { Meta, StoryObj } from '@storybook/react';
import Editor, { EditorProps } from './index';

export default {
  title: 'Design System/React UI/Editor',
  component: Editor
} as Meta<typeof Editor>;

const template = (args) => (
  <div style={{width: 400}}>
    <Editor {...args} />
  </div>
);

export const Base: StoryObj<EditorProps> = {
  args: {
    defaultValue: '<p class="SCEditor-paragraph"><br></p><p class="SCEditor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">asdsad asd </span><b><strong class="SCEditor-textBold" style="white-space: pre-wrap;">asd </strong></b><mention id="13" ext-id="null">@zulayafi</mention></p><p class="SCEditor-paragraph"><br></p><p class="SCEditor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">asdasdasd</span></p><p class="SCEditor-paragraph"><br></p><p class="SCEditor-paragraph"><br></p><p class="SCEditor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">asdasdasd</span></p><p class="SCEditor-paragraph"><div style="position: relative;padding-bottom:141.61220043572985%"><img src="https://static.quentrix.com/dhpyt711mb8h2n3m/upfiles/cache/71/47/7147e54e19d51b1b06c03cc326ea0bfc.jpg" alt="null" style="position: absolute;width:100%;height:100%;" data-width="459" data-height="650"></div></p><p class="SCEditor-paragraph"><br></p>',
    onChange: (value) => console.log(value),
    toolbar: false,
    uploadImage: false
  },
  render: template
};
