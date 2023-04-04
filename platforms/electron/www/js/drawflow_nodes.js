function addNodeToDrawFlow(name, pos_x, pos_y) {
    if(editor.editor_mode === 'fixed') {
      return false;
    }
    pos_x = pos_x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));


    switch (name) {
      case 'model':
      var facebook = `
      <div>
        <div class="title-box"><i class="fab fa-facebook"></i> Модель</div>
      </div>
      `;
        editor.addNode('model', 0,  1, pos_x, pos_y, 'model', {}, facebook );
        break;
      case 'slack':
        var slackchat = `
        <div>
          <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
        </div>
        `
        editor.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat );
        break;
      case 'github':
        var githubtemplate = `
        <div>
          <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
          <div class="box">
            <p>Enter repository url</p>
          <input type="text" df-name>
          </div>
        </div>
        `;
        editor.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": ''}, githubtemplate );
        break;
      case 'telegram':
        var telegrambot = `
        <div>
          <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
          <div class="box">
            <p>Send to telegram</p>
            <p>select channel</p>
            <select df-channel>
              <option value="channel_1">Channel 1</option>
              <option value="channel_2">Channel 2</option>
              <option value="channel_3">Channel 3</option>
              <option value="channel_4">Channel 4</option>
            </select>
          </div>
        </div>
        `;
        editor.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3'}, telegrambot );
        break;
      case 'aws':
        var aws = `
        <div>
          <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
          <div class="box">
            <p>Save in aws</p>
            <input type="text" df-db-dbname placeholder="DB name"><br><br>
            <input type="text" df-db-key placeholder="DB key">
            <p>Output Log</p>
          </div>
        </div>
        `;
        editor.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' }}, aws );
        break;
      case 'log':
          var log = `
          <div>
            <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
          </div>
          `;
          editor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log );
          break;
        case 'google':
          var google = `
          <div>
            <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
          </div>
          `;
          editor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google );
          break;
        case 'email':
          var email = `
          <div>
            <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
          </div>
          `;
          editor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email );
          break;

        case 'template':
          var template = `
          <div>
            <div class="title-box"><i class="fas fa-code"></i> Template</div>
            <div class="box">
              Ger Vars
              <textarea df-template></textarea>
              Output template with vars
            </div>
          </div>
          `;
          editor.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template'}, template );
          break;
        case 'multiple':
          var multiple = `
          <div>
            <div class="box">
              Multiple!
            </div>
          </div>
          `;
          editor.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple );
          break;
        case 'personalized':
          var personalized = `
          <div>
            Personalized
          </div>
          `;
          editor.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized );
          break;
        case 'dbclick':
          var dbclick = `
          <div>
          <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
            <div class="box dbclickbox" ondblclick="showpopup(event)">
              Db Click here
              <div class="modal" style="display:none">
                <div class="modal-content">
                  <span class="close" onclick="closemodal(event)">&times;</span>
                  Change your variable {name} !
                  <input type="text" df-name>
                </div>

              </div>
            </div>
          </div>
          `;
          editor.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: ''}, dbclick );
          break;

      default:
    }
  }