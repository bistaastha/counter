let count = 1;
//These are excluded from the final count.
const initialCheckCount = 6;
module.exports = (app) => {

  // example of probot responding 'Hello World' to a new issue being opened
  app.on('issue_comment.created', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls. This will return:
    //   {owner: 'yourname', repo: 'yourrepo', number: 123, body: 'Hello World!}
    //fetch issue number
    const str = context.payload.comment.body;
    const issueObject = await context.github.issues.listComments({
      owner: 'bistaastha',
      repo: 'bot-showcase', 
      issue_number: '7'
    });

    let checklists = issueObject.data.filter(function (comment) {
    return (comment.user.type == "Bot") && (comment.body.substring(0, 15) == "# Checklist for");
    })
//mapping not required for total check calculation
    let totalCheckCount = checklists.map(function (element) {
      return ((element.body.match(/\[x\]/g) || []).length) + ((element.body.match(/\[ \]/g) || []).length);
    })

    console.log(totalCheckCount);
    totalCheckCount = totalCheckCount.map(function (element) {
      return element - initialCheckCount;
    });

    let positiveCheckCount = checklists.map(function (element) {

        let checkCount =  +((element.body.match(/\[x\]/g) || []).length) - initialCheckCount;
        if (checkCount <= 0)
          return 0;
        else
          return checkCount;
    })

    let percentages = positiveCheckCount.map(function (element) {
      let p = Math.floor((element/totalCheckCount[0]) * 100);
      return p;
    })


    console.log((percentages));
    if (count == 1)
    {
      count -= 1;
      return context.github.issues.createComment(context.issue({ body: 'one' }));
    }
    return 0;
  })
}

/*Steps:
- Link the above code to commands
- create different files for Events and projects
- refer to other probots
*/

/*commands(app, 'generate', (context, command) => {
  const statusArray = command.arguments.split(/, */
  /*const status = statusArray[0];
  const pullRequestURL = context.payload.issue.html_url;
  const config = async() => await context.config('config.yml');
  //Badge is pending unless otherwise specified

  let finalBadgeURL = config.passingBadgeURL;
  /*if (status == "passing")
  {
    if(config.passingBadgeURL)
    console.log(config.passingBadgeURL);
     // finalBadgeURL = passingBadgeURL;
  }
  if (status == "silver")
  {
    if(config.silverBadgeURL)
      finalBadgeURL = silverBadgeURL;
  }
  if (status == "gold")
  {
    if(config.goldBadgeURL)
      finalBadgeURL = goldBadgeURL;
  }*/
  /*finalBadgeURL += "&link=" + pullRequestURL;
  const instructions =
  `Paste the Markdown link below where you want the badge displayed.`;
  const finalBadge = "![badge-level](" + finalBadgeURL + ")";
  
  const badgeMessage = finalBadge + "\n" + instructions + "\n```\n" + "Markdown: " + finalBadge + "\n```" ;
  return context.github.issues.createComment(
    context.issue({ body: badgeMessage })
  );
});*/
