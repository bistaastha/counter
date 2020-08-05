let count = 1;
module.exports = (app) => {

  // example of probot responding 'Hello World' to a new issue being opened
  app.on('issue_comment.created', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls. This will return:
    //   {owner: 'yourname', repo: 'yourrepo', number: 123, body: 'Hello World!}
    const str = context.payload.comment.body
    const issueObject = await context.github.issues.listComments({
      owner: 'bistaastha',
      repo: 'bot-showcase', 
      issue_number: '7'
    });

    let checklists = issueObject.data.filter(function (comment) {
    return (comment.user.type == "Bot") && (comment.body.substring(0, 15) == "# Checklist for");
    })

    console.log(checklists);
    // Post a comment on the issue
    if (count == 1)
    {
      count -= 1;
      return context.github.issues.createComment(context.issue({ body: 'one' }));
    }
    return 0;
  })

  const countChecks = (commentString) =>
  {
    let countedChecks = 0;

    return countedChecks;
  }
}

/*Steps:
- Create an empty object for each pull request when it is opened
- Check the subsequent issue_comment.created instances, if the comment says # Checklist for and is make by a bot, store 
the API url in the object with pr details
- when /count is invoked, count the number of tick marks and generate the percentage
- print the subsequent badge

Alternatively, get all comments by the bot at the time generate is invoked and pick out the relevant ones, then count the markdown tick marks. 
- This can be done
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
